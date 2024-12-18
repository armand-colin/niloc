export { Address, AddressType } from "./core/Address";
export { Message } from "./core/Message";
export type { Network } from "./core/Network";
export { Router } from "./core/Router";
export type { Channel } from "./channel/Channel";
export { Identity } from "./core/Identity";
export { Authority } from "./sync/Authority";

// Serialize
export { BinaryReader } from "./serialize/BinaryReader"
export { BinaryWriter } from "./serialize/BinaryWriter"
export { staticImplements } from "./tools/staticImplements"
export type { Serializable } from "./serialize/Serializable"
export type { Deserializer } from "./serialize/Deserializer"

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
export { User } from "./sync/presence/User"
export { ConnectionList } from "./sync/presence/ConnectionList"
export { ConnectionPlugin } from "./sync/presence/ConnectionPlugin"
export type { ConnectionListEvents } from "./sync/presence/ConnectionList"

// rpc
export { RPC } from "./rpc/RPC"
export { RPCHandler } from "./rpc/RPCHandler"
export { RPCPlugin } from "./rpc/RPCPlugin"

// Re-exports for implementation purposes
export { Emitter } from "@niloc/utils"

// Plugins
export { SendLoopPlugin } from "./sync/plugins/SendLoopPlugin"

// Assert 
export { Assert } from "./assert/Assert"
export type { AssertContext } from "./assert/AssertContext"
export { AssertHandler } from "./assert/AssertHandler"
export { AssertPlugin } from "./assert/AssertPlugin"

export { field, rpc, assert } from "./decorators/main"

export { Framework, FrameworkChannels } from "./core/Framework"
export type { FrameworkOptions } from "./core/Framework"