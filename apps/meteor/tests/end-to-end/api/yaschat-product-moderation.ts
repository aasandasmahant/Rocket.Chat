import { after, before, describe, it } from 'node:test';

import type { Credentials } from '@rocket.chat/api-client';
import type { IUser } from '@rocket.chat/core-typings';
import { expect } from 'chai';

import { credentials, getCredentials, request } from '../../data/api-data';
import { restorePermissionToRoles } from '../../data/permissions.helper';
import { password } from '../../data/user';
import { createUser, deleteUser, login } from '../../data/users.helper';
import type { TestUser } from '../../data/users.helper';

const moderationPermission = 'yaschat-product-moderation';
const recordId = 'yaschat-api-authorization-regression-record';

describe('[YasChat product moderation API authorization]', () => {
	let ordinaryUser: TestUser<IUser>;
	let ordinaryUserCredentials: Credentials;

	before((_t, done) => getCredentials(done));

	before(async () => {
		ordinaryUser = await createUser();
		ordinaryUserCredentials = await login(ordinaryUser.username, password);
	});

	after(async () => {
		await restorePermissionToRoles(moderationPermission);
		if (ordinaryUser) {
			await deleteUser(ordinaryUser);
		}
	});

	describe('yaschat.admin.products.history', () => {
		it('rejects unauthenticated requests', async () => {
			await request.get('/api/v1/yaschat.admin.products.history').query({ recordId }).expect(401);
		});

		it('rejects an authenticated user without the moderation permission', async () => {
			await request
				.get(api('yaschat.admin.products.history'))
				.set(ordinaryUserCredentials)
				.query({ recordId })
				.expect(403)
				.expect((res) => {
					expect(res.body).to.have.property('success', false);
					expect(res.body).to.have.property('errorType', 'error-forbidden');
				});
		});

		it('allows the administrator with the default moderation permission', async () => {
			await request
				.get(api('yaschat.admin.products.history'))
				.set(credentials)
				.query({ recordId })
				.expect('Content-Type', 'application/json')
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('success', true);
					expect(res.body).to.have.property('history').that.is.an('array');
				});
		});
	});

	for (const [route, body] of [
		['yaschat.admin.products.approve', { recordId, expectedVersion: 1 }],
		['yaschat.admin.products.reject', { recordId, expectedVersion: 1, reason: 'Authorization regression test' }],
	] as const) {
		describe(route, () => {
			it('rejects unauthenticated requests', async () => {
				await request.post(`/api/v1/${route}`).send(body).expect(401);
			});

			it('rejects an authenticated user without the moderation permission', async () => {
				await request
					.post(api(route))
					.set(ordinaryUserCredentials)
					.send(body)
					.expect(403)
					.expect((res) => {
						expect(res.body).to.have.property('success', false);
						expect(res.body).to.have.property('errorType', 'error-forbidden');
					});
			});
		});
	}
});
