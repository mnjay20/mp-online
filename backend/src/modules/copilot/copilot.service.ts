import { supabaseAdmin } from '../../config/supabase.js';
import { AIService } from '../../services/ai.service.js';
import { NotFoundError } from '../../utils/errors.js';

export class CopilotService {
  static async getConversations(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('agent_conversations')
      .select('*')
      .eq('student_id', studentId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getConversationMessages(studentId: string, conversationId: string) {
    // Check conversation ownership
    const { data: conv, error: convError } = await supabaseAdmin
      .from('agent_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('student_id', studentId)
      .single();

    if (convError || !conv) {
      throw new NotFoundError('Conversation not found');
    }

    const { data: messages, error } = await supabaseAdmin
      .from('agent_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { conversation: conv, messages };
  }

  static async chat(studentId: string, conversationId: string | undefined, userMessage: string) {
    let convId = conversationId;

    // Create a new conversation if not specified
    if (!convId) {
      const summaryTitle = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
      const { data: newConv, error: createError } = await supabaseAdmin
        .from('agent_conversations')
        .insert({
          student_id: studentId,
          title: summaryTitle,
        })
        .select()
        .single();

      if (createError) throw createError;
      convId = newConv.id;
    }

    // Record user message
    await supabaseAdmin.from('agent_messages').insert({
      conversation_id: convId,
      role: 'USER',
      content: userMessage,
    });

    // Call FastAPI AI Copilot
    const aiResponse = await AIService.chat({
      conversation_id: convId,
      student_id: studentId,
      message: userMessage,
    }) as any;

    const replyContent = aiResponse.message || 'I have analyzed your profile and query.';

    // Record AI assistant response
    const { data: savedAssistantMsg, error: saveMsgError } = await supabaseAdmin
      .from('agent_messages')
      .insert({
        conversation_id: convId,
        role: 'ASSISTANT',
        content: replyContent,
        structured_data: aiResponse,
      })
      .select()
      .single();

    if (saveMsgError) throw saveMsgError;

    // Update conversation timestamp
    await supabaseAdmin
      .from('agent_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', convId);

    return {
      conversation_id: convId,
      message: savedAssistantMsg,
      structured_data: aiResponse,
    };
  }

  static async recommendCareer(studentId: string) {
    return AIService.recommendCareer({ student_id: studentId });
  }

  static async analyzeSkillGap(studentId: string, careerId: string) {
    const result = await AIService.analyzeSkillGap({ student_id: studentId, career_id: careerId }) as any;

    // Store or update in skill_gap_analysis
    if (result.readiness_score !== undefined) {
      const { data: analysis } = await supabaseAdmin
        .from('skill_gap_analysis')
        .upsert(
          {
            student_id: studentId,
            career_id: careerId,
            overall_readiness_score: result.readiness_score,
          },
          { onConflict: 'student_id,career_id' }
        )
        .select()
        .single();

      if (analysis && result.gap_items && Array.isArray(result.gap_items)) {
        await supabaseAdmin.from('skill_gap_items').delete().eq('analysis_id', analysis.id);
        const gapItems = result.gap_items.map((item: any) => ({
          analysis_id: analysis.id,
          skill_id: item.skill_id,
          current_proficiency: item.current_proficiency,
          required_proficiency: item.required_proficiency,
          gap_score: item.gap_score,
          priority: item.priority || 'HIGH',
        }));
        await supabaseAdmin.from('skill_gap_items').insert(gapItems);
      }
    }

    return result;
  }

  static async generateRoadmap(studentId: string, careerId: string, targetMonths: number) {
    return AIService.generateRoadmap({ student_id: studentId, career_id: careerId, target_months: targetMonths });
  }

  static async matchJobs(studentId: string) {
    return AIService.matchJobs({ student_id: studentId });
  }

  static async matchInternships(studentId: string) {
    return AIService.matchInternships({ student_id: studentId });
  }
}
