# Security Policy

## Reporting a vulnerability

Email **[security@openmrp.ai](mailto:security@openmrp.ai)**, or use
[GitHub private vulnerability reporting](https://github.com/open-mrp/ui/security/advisories/new).
Please do not open a public issue, and do not disclose publicly until we have shipped a fix.

Include whatever you have: the affected component, steps to reproduce, what an attacker gains, and
any proof of concept. A working reproduction gets a fix out considerably faster than a description.

We aim to acknowledge within 3 business days and to give you an assessment and a rough timeline
within 10. We will keep you updated as the fix progresses and will credit you when it ships, unless
you would rather stay anonymous.

## Scope

This repository is `@openmrp/ui`, the React component library published to npm. In scope:

- Cross-site scripting or injection reachable through a component's props
- Dependency vulnerabilities in what the published package ships
- Anything in the build or release pipeline that could let a third party publish as `@openmrp/ui`

Vulnerabilities in the OpenMRP API or the product itself are welcome at the same address — they are
just not tracked here.

## Which versions

Only the latest published minor of `@openmrp/ui` receives fixes. Upgrade before reporting an issue
against an older release.

## A note on test credentials

Storybook stories use fabricated sample values such as `sk_test_abcdef1234567890...`. These are not
real keys. If you believe you have found a **real** credential in this repository, report it
privately using the process above.
