# Task Preamble
Conduct objective and comprehensive code review of a GitHub pull request for the Telegram Mini App finance tracker project.

# Input Definitions
- Pull request URL or number
- Branch name being reviewed
- Feature(s) being implemented
- Files changed in the PR

# High Level Overview
Systematically review all aspects of the pull request: feature implementation, test coverage, coding standards compliance, documentation accuracy, and adherence to repository principles. Provide objective findings with clear severity levels and actionable recommendations.

# Detailed Instructions

## Feature Implementation Review
- Verify all features described in the PR are actually implemented
- Check if implementation matches design.md specifications
- Validate functionality against business requirements
- Identify any incomplete or partial implementations
- Test edge cases and error scenarios mentally or through code analysis

## Test Coverage Analysis
- Verify tests exist for all new functionality
- Check if test coverage is comprehensive (happy path, edge cases, error handling)
- Ensure tests follow repository testing standards
- Identify untested code paths
- Validate test quality and assertions

## Coding Principles Compliance
- DRY: Check for code duplication; flag opportunities for helper extraction
- KISS: Identify unnecessary complexity; suggest simpler solutions
- YAGNI: Flag over-engineered features or premature abstractions
- Single responsibility: Verify files stay within ~500-600 line limit
- File organization: Check if files are organized by feature/domain, not by type

## Code Quality Standards
- Verify code follows CODING_STYLE.md requirements
- Check naming conventions are clear and meaningful
- Review documentation and comments adequacy
- Validate error handling approach (no silent failures, explicit error propagation)
- Check type safety (no unnecessary `as any` casts)
- Verify use of existing helpers and patterns

## Documentation Updates
- Check if AGENTS.md is updated appropriately
- Verify changes to design.md or architecture.md if needed
- Review inline comments explain why, not what
- Validate docstrings/JSDoc for public functions
- Check for DRY principle in documentation (no duplication, use pointers instead)

## Git Workflow Compliance
- Verify branch naming convention is followed
- Check commit messages are atomic and clear
- Validate PR description is comprehensive
- Ensure PR follows PR template requirements
- Review if branch will be deleted after merge

## Security and Performance
- Identify potential security vulnerabilities
- Review for performance regressions or inefficiencies
- Check for proper input validation and sanitization
- Validate authentication/authorization implementation if relevant

# Output Requirements
- Structured review with clear sections and findings
- Issues ordered by severity (Critical, High, Medium, Low)
- Each finding includes: file path, line number, description, and suggested fix
- Separate sections for blockers vs. suggestions
- Summary of overall PR quality and readiness
- Recommendation: Approve, Request Changes, or Needs Discussion

# Output Template

```
# PR Review: [PR Title]
## Summary

[Overall assessment of the PR quality and readiness]

## Findings
### Blockers (Must fix before merge)
- [Finding 1]: path/to/file:line - [Description and suggested fix]
- [Finding 2]: path/to/file:line - [Description and suggested fix]
### High Priority Issues
- [Issue 1]: path/to/file:line - [Description and suggestion]
- [Issue 2]: path/to/file:line - [Description and suggestion]
### Medium Priority Issues
- [Issue 1]: path/to/file:line - [Description]
- [Issue 2]: path/to/file:line - [Description]
### Suggestions & Best Practices
- [Suggestion 1]: [Context and recommendation]
- [Suggestion 2]: [Context and recommendation]

## Coverage Analysis
- Test coverage: [Percentage/assessment]
- Untested code paths: [List if any]
- Coverage recommendation: [Accept/Request additional tests]

## Standards Compliance
- CODING_STYLE.md: [Compliant/Issues found]
- Design principles (DRY/KISS/YAGNI): [Assessment]
- Documentation: [Assessment]
- Git workflow: [Assessment]

## Recommendation

[ ] Approve
[ ] Request Changes
[ ] Discuss Further

## Reviewer Notes

[Any additional context or observations]
```

# Optional Context
Be objective and professional. Focus on facts and code patterns rather than opinion. When suggesting changes, explain the reasoning based on repository standards and design principles. Flag truly blocking issues separately from suggestions. Kyrylo