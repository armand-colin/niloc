export { Address, AddressType } from "./core/Address";
export type { Message } from "./core/Message";
export { Network } from "./core/Network";
export type { NetworkEvents } from "./core/Network";
export { Peer } from "./core/Peer";
export type { PeerEvents } from "./core/Peer";
export { Router } from "./core/Router";
export type { Channel } from "./channel/Channel";
export { Identity } from "./core/Identity";
export { Authority } from "./sync/Authority";

// sync
export { Model } from "./sync/Model"
export type { ObjectRequest } from "./sync/Model.interface"
export { SyncObject } from "./sync/SyncObject"
export type { SyncObjectType } from "./sync/SyncObjectType"
export { BinaryReader } from "./serialize/BinaryReader"
export { BinaryWriter } from "./serialize/BinaryWriter"

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

// Time 
export { Time } from "./time/Time"
export { TimeSynchronizer } from "./time/TimeSynchronizer"
export type { TimeSynchronizerOpts } from "./time/TimeSynchronizer"

export { field, rpc, assert } from "./decorators/main"

export { Framework, FrameworkChannels } from "./core/Framework"
export type { FrameworkOptions } from "./core/Framework"