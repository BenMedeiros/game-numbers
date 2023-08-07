'use strict';

// binds event to functions instead of event names so you don't have to manage strings everywhere
const eventSubscriptionsMap = {};

document.addEventListener('new-game', () => {
    for (const key of Object.keys(eventSubscriptionsMap)) {
        delete eventSubscriptionsMap[key];
    }
})

// [fn.name[el] = cb}]
export function triggerFunctionEvent(fn, payload) {
    if (eventSubscriptionsMap[fn.name] !== undefined) {
        for (const [key, cb] of Object.entries(eventSubscriptionsMap[fn.name])) {
            cb(payload);
        }
    }
}

//must include el if it is going to be deleted later
export function onFunctionEvent(fn, uniqueKey, cb) {
    if (eventSubscriptionsMap[fn.name] === undefined) {
        eventSubscriptionsMap[fn.name] = {};
    }
    //assumption is there is no need for a uniquekey/element to use the same event twice
    if (!eventSubscriptionsMap[fn.name][uniqueKey]) {
        eventSubscriptionsMap[fn.name][uniqueKey] = cb;
    } else {
        throw new Error('Why are there multiple cb for the same fn-uniqueKey?');
    }
}

export function removeFunctionEvents(uniqueKey) {
    for (const fnEventsMap of Object.values(eventSubscriptionsMap)) {
        delete fnEventsMap[uniqueKey];
    }
}

export function branchDeleted(branchIndex) {
    triggerFunctionEvent(branchDeleted, branchIndex);
}

export function branchCreated(branchIndex) {
    triggerFunctionEvent(branchCreated, branchIndex);
}

export function moveMade(branchIndex, moveIndex) {
    triggerFunctionEvent(moveMade, {branchIndex, moveIndex});
}

export function moveHistoryEmpty() {
    triggerFunctionEvent(moveHistoryEmpty);
}

export function branchAllowed() {
    triggerFunctionEvent(branchAllowed)
}

export function branchNotAllowed() {
    triggerFunctionEvent(branchNotAllowed);
}