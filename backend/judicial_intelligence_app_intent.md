# Judicial Intelligence Platform --- System Intent & Architecture Prompt

## Purpose of This Document

This document defines the **core intent, architecture, and guardrails**
for the Judicial Intelligence Platform.\
It is meant to guide developers, AI coding assistants, and contributors
so that the system evolves **without breaking architectural
boundaries**.

------------------------------------------------------------------------

# Platform Vision

The Judicial Intelligence Platform is an **AI‑powered Nigerian legal
intelligence system** that combines:

-   Legal research
-   Legal operations tools
-   Legal training simulations

The goal is to build a **next‑generation legal infrastructure platform**
comparable to global systems like Westlaw or LexisNexis, but enhanced
with AI capabilities specifically tailored for the Nigerian legal
system.

The system integrates:

-   Court judgment intelligence
-   Legal research tools
-   State procedural rules engines
-   AI legal drafting
-   Cause list alerts
-   Legal training simulations
-   AI Moot Court practice environments

------------------------------------------------------------------------

# Core Technology Stack

The platform uses a **hybrid architecture** consisting of:

### Backend Services

**Django** - Authentication system - SaaS multi‑tenancy - Core database
models - Governance and permissions - Audit logging - Business logic for
platform entities

**FastAPI** - AI services - Legal reasoning engines - Scraping
infrastructure - Rules engine APIs - High‑concurrency endpoints

### Data Infrastructure

**Vector Database** - Legal precedent similarity search - Embeddings for
judgments - Semantic legal research

### Data Pipelines

**Scrapers** - Court judgment extraction - Cause list monitoring - Legal
data ingestion

### Frontend

**Next.js** - User dashboards - Research interface - Simulation
interfaces - PWA mobile experience

------------------------------------------------------------------------

# Architectural Guardrails (CRITICAL)

AI coding agents or developers must **never violate the architecture
boundaries below.**

## Backend Responsibility Separation

### Django Responsibilities

Django is responsible for:

-   User authentication
-   SaaS multi‑tenancy
-   Database models
-   Permissions and governance
-   Administrative dashboards
-   Billing infrastructure
-   Audit logs

Django **must not contain:**

-   AI model execution
-   web scrapers
-   vector search logic

------------------------------------------------------------------------

### FastAPI Responsibilities

FastAPI is responsible for:

-   AI services
-   LLM integrations
-   Scraping pipelines
-   Legal rules engine
-   Vector search services
-   High‑performance APIs

FastAPI **must not contain:**

-   authentication logic
-   SaaS account management
-   user permission systems

------------------------------------------------------------------------

### Next.js Responsibilities

Next.js handles:

-   frontend UI
-   dashboards
-   chat interfaces
-   legal research UI
-   simulation interfaces
-   PWA functionality

Next.js **must never contain backend logic.**

------------------------------------------------------------------------

# Core Platform Modules

The following modules define the platform's major capabilities.

## 1. Judgment Scraping Engine

Collects court judgments from:

-   Supreme Court
-   Court of Appeal
-   Federal High Court
-   State High Courts

Responsibilities:

-   scrape HTML/PDF judgments
-   extract case metadata
-   store raw data for processing

------------------------------------------------------------------------

## 2. Judgment Normalization Pipeline

Transforms scraped judgments into structured data:

Fields include:

-   case title
-   citation
-   court
-   judge
-   date
-   legal issues
-   decision outcome

This structured dataset powers AI search and analysis.

------------------------------------------------------------------------

## 3. AI Judgment Summarization

Large judgments are summarized automatically into:

-   Facts
-   Legal issues
-   Arguments
-   Court reasoning
-   Decision
-   Key precedents

------------------------------------------------------------------------

## 4. Vector Precedent Search

Judgments are embedded into vector space.

This allows semantic queries like:

"Find cases similar to breach of contract involving land disputes."

Vector search returns:

-   similar judgments
-   precedent chains
-   related legal issues

------------------------------------------------------------------------

## 5. Cause List Alert System

Scrapes daily court cause lists and sends alerts to users when:

-   their cases appear
-   related matters are listed
-   hearings are scheduled

Alerts may be delivered through:

-   web notifications
-   email
-   mobile push notifications

------------------------------------------------------------------------

## 6. Legal Drafting AI

AI assists lawyers in generating:

-   motions
-   affidavits
-   statements of claim
-   written addresses

Documents are generated using Nigerian procedural rules.

------------------------------------------------------------------------

# Legal Training System

The platform also functions as a **legal training environment**.

This includes the **AI Moot Court Engine**.

------------------------------------------------------------------------

# AI Moot Court Engine Architecture

The Moot Court system simulates courtroom litigation practice.

It consists of:

-   Judge personas
-   Dialogue engine
-   Argument scoring system
-   Legal reasoning evaluation
-   Scenario DSL

------------------------------------------------------------------------

## Simulation Data Models

### SimulationScenario

Defines the legal scenario.

Fields include:

-   title
-   legal category
-   case background
-   governing laws
-   judge persona
-   difficulty level

------------------------------------------------------------------------

### SimulationSession

Tracks user participation.

Fields include:

-   user
-   scenario
-   session start
-   score
-   AI feedback

------------------------------------------------------------------------

### SimulationMessage

Stores the conversation between the user and AI judge.

Fields include:

-   role (judge/user)
-   message
-   timestamp

------------------------------------------------------------------------

# Judge Personas

Each judge persona reflects a courtroom style.

Examples:

-   strict constitutional judge
-   pragmatic commercial judge
-   skeptical criminal court judge

These personas influence AI questioning patterns.

------------------------------------------------------------------------

# Courtroom Dialogue Engine

Users submit arguments.

The AI judge:

-   asks probing questions
-   challenges legal reasoning
-   references precedent
-   demands clarification

This creates a realistic courtroom interaction.

------------------------------------------------------------------------

# Scoring Engine

After the session, the AI evaluates:

-   legal accuracy
-   strength of argument
-   logical reasoning
-   precedent usage
-   clarity of advocacy

A performance score and feedback are returned.

------------------------------------------------------------------------

# Legal Reasoning Evaluation

Arguments are analyzed for:

-   constitutional grounding
-   statutory interpretation
-   precedent citation
-   logical consistency

This encourages development of strong legal reasoning.

------------------------------------------------------------------------

# Scenario DSL

Simulation scenarios may be written in a structured format like:

Scenario: Case type: Electoral dispute

Legal issue: Constitutional interpretation

Relevant law: Section 221 Nigerian Constitution

Judge persona: Strict constitutionalist

This allows the system to generate courtroom dialogue dynamically.

------------------------------------------------------------------------

# Strategic Platform Direction

The system intentionally combines three domains:

## 1. Legal Research Platform

AI search and legal precedent discovery.

## 2. Legal Operations Platform

Rules engines, alerts, and workflow tools.

## 3. Legal Training Platform

AI courtroom simulations and advocacy training.

Together these create a **defensible legal technology platform.**

------------------------------------------------------------------------

# Long‑Term Strategic Asset

As the platform collects thousands of simulation interactions, it will
accumulate:

-   lawyer arguments
-   legal reasoning patterns
-   courtroom strategies

This dataset can be used to train:

**AI models specialized in Nigerian legal reasoning.**

This becomes extremely valuable intellectual property.

------------------------------------------------------------------------

# Final Rule

Developers and AI coding assistants must always respect the system
boundary:

Django = Auth + SaaS + Models\
FastAPI = AI + Scraping + Rules Engine\
Next.js = Frontend

No exceptions.
