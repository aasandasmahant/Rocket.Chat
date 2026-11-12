import * as z from 'zod';

import { YasChatProductModerationStatusSchema } from './IProductAdmin';

/**
 * Explicit moderation transitions. Persistence services must still verify the
 * actor's Rocket.Chat permissions and apply the transition atomically.
 */
export const YasChatProductModerationTransitionSchema = z
	.object({
		from: YasChatProductModerationStatusSchema,
		to: YasChatProductModerationStatusSchema,
		actorId: z.string().trim().min(1).max(120),
		occurredAt: z.string().datetime(),
		reason: z.string().trim().min(1).max(1000).optional(),
	})
	.superRefine((transition, context) => {
		const allowed: Record<string, string[]> = {
			'draft': ['pending-review', 'archived'],
			'pending-review': ['draft', 'approved', 'rejected'],
			'approved': ['archived'],
			'rejected': ['draft', 'archived'],
			'archived': ['draft'],
		};

		if (!allowed[transition.from]?.includes(transition.to)) {
			context.addIssue({
				code: 'custom',
				message: `Transition from ${transition.from} to ${transition.to} is not allowed`,
				path: ['to'],
			});
		}

		if (transition.to === 'rejected' && !transition.reason) {
			context.addIssue({
				code: 'custom',
				message: 'Rejecting a product requires a reason',
				path: ['reason'],
			});
		}
	});

export type YasChatProductModerationTransition = z.infer<typeof YasChatProductModerationTransitionSchema>;
export const parseYasChatProductModerationTransition = (input: unknown) => YasChatProductModerationTransitionSchema.parse(input);
