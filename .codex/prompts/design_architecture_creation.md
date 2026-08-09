# Task Preamble
Create comprehensive design and architecture documentation for the Telegram Mini App finance tracker.

# Input Definitions
- Project scope: Telegram Mini App finance tracker features and functionalities
- Business requirements: What the app should accomplish
- Target users: Who will use the application
- Key features: Primary functionalities to implement

# High Level Overview
Generate two documentation files: `design.md` describing business value and user-facing functionalities in non-technical language, and `architecture.md` detailing technical implementation, technology stack, patterns, and solutions. Leverage available skills throughout the process to enhance design quality and efficiency.

# Detailed Instructions

## design.md Creation
- Write from business and user perspective
- Focus on what the app does, not how it's built
- Describe all user-facing functionalities and features
- Use business language and terminology
- Only mention Telegram Mini App platform capabilities and specific Telegram functions when relevant
- Avoid technical implementation details, programming languages, or specific frameworks
- Structure with clear sections: Overview, Key Features, User Experience, Business Goals
- Use markdown formatting (headers, lists, emphasis)

## architecture.md Creation
- Write from technical implementation perspective
- Describe how design.md requirements will be implemented
- Specify technology stack, frameworks, and programming languages
- Detail system architecture, components, and their interactions
- Explain design patterns, data flow, and API structure
- Include diagrams descriptions or reference to architecture visualization
- Define database schema, authentication, and security approach
- Structure with sections: Technical Stack, System Architecture, Components, Data Flow, Deployment
- Use technical language and specific technology names
- Reference design.md sections to show how features are implemented

## Leverage Available Skills
- Use `/excalidraw` to create architecture diagrams and system visualizations
- Use `/frontend-design` if creating UI/UX mockups or design specifications
- Use any other relevant skills to enhance documentation quality and clarity
- Apply skills proactively throughout development, not just as afterthoughts

# Output Requirements
- `design.md`: Business-focused design document following markdown standards
- `architecture.md`: Technical architecture document following markdown standards
- Both files use consistent markdown formatting
- Clear section hierarchies with H2 and H3 headers
- Both files reference each other appropriately
- Architecture diagrams created using available skills
- Proper file structure and naming conventions

# Output Template

**design.md:**
```
# Finance Tracker - Product Design

## Overview

[Brief description of what the app does]

## Key Features
### [Feature 1]
### [Feature 2]
### [Feature 3]
## User Experience

[How users interact with the app]

## Business Goals

[What success looks like]
```

**architecture.md:**
```
# Finance Tracker - Technical Architecture
## Technology Stack
- [Language/Framework]
- [Database]
- [Deployment platform]
## System Architecture

[Diagram description or reference to generated diagram]

## Components
## Data Flow

[How data moves through the system]
```

# Optional Context
Both documents should be stored in `docs/` directory. Create them as complementary documents where architecture.md references and implements the features described in design.md. Update AGENTS.md after creating both files, mentioning that design and architecture documentation is available. Use available skills to enhance visualizations and documentation quality throughout the creation process.