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
export { Template } from "./sync/Template"
export { SyncObject } from "./sync/SyncObject"

//  field
export { Field } from "./sync/field/Field"
export { AnyField } from "./sync/field/AnyField"
export { SyncObjectField } from "./sync/field/SyncObjectField"
export { SyncObjectRefField } from "./sync/field/SyncObjectRefField"
export { SyncObjectRefSetField } from "./sync/field/SyncObjectRefSetField"
export { field } from "./sync/field/namespace"

//  presence
export { Presence } from "./sync/presence/Presence"
export type { PresenceEvents } from "./sync/presence/Presence"
export { PresenceMessage } from "./sync/presence/PresenceMessage"

// rpc
export { RPC } from "./rpc/RPC"
export { RPCHandler } from "./rpc/RPCHandler"
export { RPCPlugin } from "./rpc/RPCPlugin"

// Re-exports for implementation purposes
export { Emitter } from "@niloc/utils";
