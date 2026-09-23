<?php

namespace Database\Seeders;

use App\Modules\Resource\Enums\ResourceType;
use App\Modules\Resource\Models\BlogCategory;
use App\Modules\Resource\Models\Resource;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Blog categories plus one fully-populated reference post. Everything here is
 * editable in the admin Blog section; the post shows editors every supported
 * body feature (headings, lists, a table, a quote, code, links, an image).
 * Idempotent — re-running updates rather than duplicates.
 */
class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['AI & Automation', 'ai-automation', 'Agentic workflows, LLMs in production and enterprise AI delivery.'],
            ['Engineering', 'engineering', 'Architecture, platforms and the craft of shipping reliable software.'],
            ['Talent & Hiring', 'talent-hiring', 'Staff augmentation, dedicated pods and building great teams.'],
            ['ServiceNow', 'servicenow', 'ITSM, CSDM and getting the most out of the platform.'],
            ['Company News', 'company-news', 'Announcements and updates from TeamBees.'],
        ];

        $ids = [];
        foreach ($categories as $order => [$name, $slug, $description]) {
            $ids[$slug] = BlogCategory::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'description' => $description, 'sort_order' => $order],
            )->id;
        }

        $body = <<<'MD'
Most enterprise AI pilots never reach production. Not because the models are weak, but because the **system around the model** was never engineered for the stakes involved. This post walks through the four guardrails our AI Bees pods put in place before an agent is allowed to touch a real workflow.

## Why pilots stall

A chatbot demo that is right 98% of the time looks impressive. In a bank, a 2% error rate on credit decisions or AML exceptions is a regulatory incident. The gap between *demo* and *dependable* is an engineering problem, and it has engineering answers.

> Production AI is less about bigger models and more about distributed-systems discipline applied to probabilistic components.

## The four guardrails

### 1. Typed contracts at every boundary

Every tool an agent can call accepts a strictly typed JSON schema. Free-form text never crosses into a system of record.

```json
{
  "action": "flag_transaction",
  "transaction_id": "TX-20931",
  "reason_code": "AML_WATCHLIST",
  "confidence": 0.94
}
```

### 2. Supervisor and worker agents

A supervisor decomposes the task and routes it; narrow worker agents execute bounded, tool-restricted steps. Each worker can be tested like an ordinary service.

### 3. Checkpoints and rollback

Workflows are checkpointed after every step, so a failed ledger write pauses and rolls back instead of duplicating a transaction.

### 4. Validation before execution

Deterministic validators inspect every generated payload. When validation fails, or a tool-call loop is detected, a circuit breaker hands the case to a human.

## What changes in practice

| Metric | Before | After guardrails |
| --- | --- | --- |
| Document intake turnaround | 3 days | 6 hours |
| Manual review rate | 100% | 18% |
| Critical defects in production | — | 0 |

## Getting started

1. Pick one workflow with a clear success measure.
2. Define the tool contracts before writing any prompts.
3. Ship behind a human-in-the-loop gate, then widen it as the metrics earn trust.

Want to see how this applies to your stack? [Talk to our AI practice](/practices/ai-bees) or [get in touch](/contact-us).
MD;

        Resource::updateOrCreate(
            ['slug' => 'from-ai-pilot-to-production-four-guardrails'],
            [
                'resource_type' => ResourceType::Blog,
                'blog_category_id' => $ids['ai-automation'],
                'title' => 'From AI Pilot to Production: The Four Guardrails That Make Agents Enterprise-Ready',
                'excerpt' => 'Most enterprise AI pilots stall before production. Here are the four engineering guardrails our pods put in place before an agent touches a real workflow.',
                'body' => $body,
                'cover_image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80',
                'cover_image_alt' => 'Abstract visualisation of a neural network',
                'author_name' => 'TeamBees Editorial',
                'author_role' => 'AI Bees Practice',
                'tags' => ['AI', 'Agents', 'Enterprise', 'Banking'],
                'is_featured' => true,
                'reading_time_minutes' => Resource::estimateReadingTime($body),
                'status' => ContentStatus::Published,
                'published_at' => now()->subDay(),
            ],
        );
    }
}
