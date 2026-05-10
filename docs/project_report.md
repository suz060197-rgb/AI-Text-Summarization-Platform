# Project Report: AI Text Summarization Platform

## Abstract

This project implements a full-stack AI summarization platform that helps users condense long text and PDF documents into concise summaries. It supports configurable output format, language prompts, keyword extraction, and browser-based PDF export.

## Problem Statement

Students, researchers, and professionals often need to review long documents quickly. Manual summarization is time-consuming and inconsistent. This platform demonstrates how AI services can improve document review workflows.

## Methodology

The system uses a React frontend, an Express backend, and an AI engine layer. The backend validates user input, extracts PDF text with `pdf-parse`, preprocesses content, and calls OpenAI when an API key is available. A deterministic fallback summarizer supports testing and offline demos.

## Results

The platform provides a responsive interface, structured summary output, keyword extraction, and measurable document statistics. Automated tests verify health checks, validation, text preprocessing, and summarization behavior.

## Future Enhancements

- User authentication
- Saved summary history
- Database-backed document management
- More advanced multilingual model selection
- Evaluation metrics such as ROUGE scores
