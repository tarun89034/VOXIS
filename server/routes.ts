import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processVoiceCommand, generateSystemResponse } from "./lib/openai";
import { z } from "zod";

const voiceCommandSchema = z.object({
  message: z.string().min(1),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([])
});

const systemInfoSchema = z.object({
  action: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // VOXIS voice command processing
  app.post("/api/voice/process", async (req, res) => {
    try {
      const { message, conversationHistory } = voiceCommandSchema.parse(req.body);
      
      const response = await processVoiceCommand(message, conversationHistory);
      
      res.json({
        success: true,
        response
      });
    } catch (error) {
      console.error('Voice processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process voice command'
      });
    }
  });

  // System information endpoint
  app.get("/api/system/info", async (req, res) => {
    try {
      const systemInfo = {
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userAgent: req.headers['user-agent'] || 'Unknown',
        ip: req.ip || req.connection.remoteAddress,
        server: 'VOXIS Backend v1.0'
      };

      res.json({
        success: true,
        systemInfo
      });
    } catch (error) {
      console.error('System info error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get system information'
      });
    }
  });

  // Generate system response
  app.post("/api/system/response", async (req, res) => {
    try {
      const { action } = systemInfoSchema.parse(req.body);
      
      const response = await generateSystemResponse(action);
      
      res.json({
        success: true,
        response
      });
    } catch (error) {
      console.error('System response error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate system response'
      });
    }
  });

  // Web search helper endpoint
  app.post("/api/search/web", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string().min(1) }).parse(req.body);
      
      // Create search URL for Brave Search
      const searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
      
      res.json({
        success: true,
        searchUrl,
        query
      });
    } catch (error) {
      console.error('Web search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process search request'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
