/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the Gitpod Enterprise Source Code License,
 * See License.enterprise.txt in the project root folder.
 */

import * as chai from "chai";
import { suite, test, timeout } from "mocha-typescript";
import { testContainer } from "./test-container";
import { TypeORM } from "./typeorm/typeorm";
import { WebhookEventDB } from "./webhook-event-db";
import { DBWebhookEvent } from "./typeorm/entity/db-webhook-event";
const expect = chai.expect;

@suite
@timeout(5000)
export class WebhookEventDBSpec {
    typeORM = testContainer.get<TypeORM>(TypeORM);
    db = testContainer.get<WebhookEventDB>(WebhookEventDB);

    async before() {
        await this.clear();
    }

    async after() {
        await this.clear();
    }

    protected async clear() {
        const connection = await this.typeORM.getConnection();
        const manager = connection.manager;
        await manager.clear(DBWebhookEvent);
    }

    @test public async testSafeUpdate() {
        const event = await this.db.createEvent({
            rawEvent: "payload as string",
            status: "received",
            type: "push",
        });
        const cloneUrl = "http://gitlab.local/project/repo";
        await this.db.updateEvent(event.id, {
            status: "ignored",
            rawEvent: "should not be overriden",
            type: "should not be overriden",
            cloneUrl,
        });

        const updated = (await this.db.findByCloneUrl(cloneUrl))[0];
        expect(updated, "should be found").to.be.not.undefined;
        expect(updated.status, "status should be updated").to.equal("ignored");
        expect(updated.type, "type should not be updated").to.equal("push");
        expect(updated.rawEvent, "rawEvent should not be updated").to.equal("payload as string");
    }
}

module.exports = WebhookEventDBSpec;
