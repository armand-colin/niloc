export { Address } from "./core/Address";
export type { Message } from "./core/Message";
export type { Network, NetworkEvents } from "./core/Network";
export type { Peer } from "./core/Peer";
export { Router } from "./core/Router";
export { Channel } from "./channel/Channel";
export { Context } from "./core/Context";
export { Authority } from "./sync/Authority";

// sync
export { Model } from "./sync/Model"
export { SyncObject } from "./sync/SyncObject"
export type { SyncObjectType } from "./sync/SyncObjectType"

//  field
export { Field } from "./sync/field/Field"
export { AnyField } from "./sync/field/AnyField"
export { ArrayField } from "./sync/field/ArrayField"
export { SyncObjectField } from "./sync/field/SyncObjectField"
export { SyncObjectRefField } from "./sync/field/SyncObjectRefField"
export { SyncObjectRefSetField } from "./sync/field/SyncObjectRefSetField"

//  presence
export { Presence } from "./sync/presence/Presence"
export type { PresenceEvents } from "./sync/presence/Presence"
export { ConnectionList } from "./sync/presence/ConnectionList"
export { ConnectionPlugin } from "./sync/presence/ConnectionPlugin"
export type { ConnectionListEvents } from "./sync/presence/ConnectionList"

// rpc
export { RPC } from "./rpc/RPC"
export { RPCHandler } from "./rpc/RPCHandler"
export { RPCPlugin } from "./rpc/RPCPlugin"

// Re-exports for implementation purposes
export { Emitter } from "@niloc/utils";

export { field, rpc } from "./decorators/main"