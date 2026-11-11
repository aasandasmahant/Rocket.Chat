import * as z from 'zod';

import { YasChatProductSchema } from './IProduct';

export const YasChatProductModerationStatusSchema = z.enum([
	'draft',
	'pending-review',
	'approved',
	'rejected',
	'archived',
]);

export const YasChatProductModerationSchema = z
	.object({
		status: YasChatProductModerationStatusSchema,
		reviewedBy: z.string().trim().min(1).max(120).optional(),
		reviewedAt: z.string().datetime().optional(),
		rejectionReason: z.string().trim().min(1).max(1000).optional(),
	})
	.superRefine((moderation, context) => {
		if (moderation.status === 'approved' && (!moderation.reviewedBy || !moderation.reviewedAt)) {
			context.addIssue({
				code: 'custom',
				message: 'Approved products require a reviewer and review timestamp',
				path: ['reviewedBy'],
			});
		}

		if (moderation.status === 'rejected' && !moderation.rejectionReason) {
			context.addIssue({
				code: 'custom',
				message: 'Rejected products require a reason',
				path: ['rejectionReason'],
			});
		}
	});

export const YasChatProductAdminRecordSchema = z.object({
	recordId: z.string().trim().min(1).max(160),
	product: YasChatProductSchema,
	moderation: YasChatProductModerationSchema,
	createdBy: z.string().trim().min(1).max(120),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	version: z.number().int().positive(),
});

export type YasChatProductModerationStatus = z.infer<typeof YasChatProductModerationStatusSchema>;
export type YasChatProductModeration = z.infer<typeof YasChatProductModerationSchema>;
export type YasChatProductAdminRecord = z.infer<typeof YasChatProductAdminRecordSchema>;

export const YasChatProductAdminAuditActionSchema = z.enum([
	'created',
	'updated',
	'submitted-for-review',
	'approved',
	'rejected',
	'archived',
]);

export const YasChatProductAdminAuditEventSchema = z
	.object({
		recordId: z.string().trim().min(1).max(160),
		actorId: z.string().trim().min(1).max(120),
		action: YasChatProductAdminAuditActionSchema,
		occurredAt: z.string().datetime(),
		changedFields: z.array(z.string().trim().min(1).max(120)).max(100).optional(),
		reason: z.string().trim().min(1).max(1000).optional(),
	})
	.superRefine((event, context) => {
		if (event.action === 'rejected' && !event.reason) {
			context.addIssue({
				code: 'custom',
				message: 'Rejection audit events require a reason',
				path: ['reason'],
			});
		}
	});

export type YasChatProductAdminAuditEvent = z.infer<typeof YasChatProductAdminAuditEventSchema>;
