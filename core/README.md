# Niloc - a library to build collaborative applications

Niloc is designed to give the tools to build a networking system, with a very modular approach. The core library does not ship any transport, however some have been implemented, such as Socket.IO and WebRTC. There are also some features available through the base `Router` or through other pluggable components :

- Create channels and route messages to any connected peer to your network
- Synchronize data structures through a `Model`
- Send RPCs to connected peers with a `RPCHandler`

## Installation

```cmd
yarn add niloc-core
```

## Getting started

### Create a router

The first thing you'll need to do is create a `Network`, which is your transport layer. You can implement yours, or take one of the available implementations (soon available on npm). After that, you'll need to create a `Router` to receive and send messages :

```ts
import { Router } from 'niloc-core'

const network = new MyNetwork()
const router = new Router({ 
    network,
    id: "myId", // This will be your id on the network
    host: true // This will be useful to be targeted by some messages, or with some modules like RPCs. Usually, you'll want only one host in the network
})
```

### Create channels

To send / receive messages after that, you can create channels on the router, with an index. This will be useful as you will want different modules to use different channels

```ts
import { Address } from "niloc-core"

const helloChannel = router.channel<string>(0)

// Send message to the peer with the id "myFriendId"
helloChannel.post(Address.to("myFriendId"), Date.now())

// Send message to everyone
helloChannel.post(Address.broadcast(), "Hello guys")

// Send message to network host
helloChannel.post(Address.host(), "Hello my kind host")

helloChannel.addListener((message) => {
    console.log(`"${message.originId}" sent us a hello message: ${message.data}`)
})
```

## Syncing objects

To synchronize objects, we will use a model. The model is designed to keep in sync objects that inherit from `SyncObject`. Every field of those classes that extend `Field` will be synchronized and bounded to those objects.

### Defining SyncObjects

Let's define an example `SyncObject` named `Person` with two simple fields `age` and `name`

```ts
import { SyncObject, Template } from "niloc-core"

class Person extends SyncObject {

    // Will be useful for the model later on
    public static template = Template.create("Person", Person)

    // The first value of the AnyField constructor is the default value
    public readonly age = new AnyField(0)
    public readonly name = new AnyField("noname")

}
```
To register an object type to the model, we will need a `Template`. There is a helper function `Tempalte.create` that creates a template with a `SyncObject` constructor.


### Create the model and register types
To create a model, we'll need a channel from the previously created router.

```ts
import { Model } from "niloc-core"

// Get a channel for the model
// We assume we didn't previously create "helloChannel", so the index 0 is free
const channel = router.channel(0)
const model = new Model({ channel })

// Register our type Person
model.register(Person.template)
```

Later on, we will be able to instantiate `Person` instances like so:

```ts
const person = model.instantiate(Person.template)
```

To make changes to the fields, we can use the methods available

```ts
// Time to drink
person.age.set(21)
person.name.set("John")
model.tick()
```

Don't forget to call `model.tick()`! By default, the model doesn't send the changes until you tell it to. Calling this methods lets the model collect all the changes and send it through its channel.

### Complex fields

#### SyncObjectField

Useful when you have nested data structures, but you don't want to synchronize the whole struct with a single change.

```ts
import { SyncObjectField } from "niloc-core"

class Point extends SyncObject {

    static template = Template.create("Point", Point)

    readonly x = new AnyField(0)
    readonly y = new AnyField(0)

}

class Segment extends SyncObject {

    static template = Template.create("Segment", Segment)

    readonly a = new SyncObjectField(Point.template)
    readonly b = new SyncObjectField(Point.template)

}

model.register(Segment.template)

const segment = model.instantiate(Segment.template)

const pointA = segment.a.get()
const pointB = segment.a.get()

pointA.x.set(10)
pointA.y.set(-1)

pointB.x.set(20)
pointB.y.set(-7)

model.tick()
```

This example is not really what should be done in this case, but gives you a good example on how to use it.

#### SyncObjectRefField

Similar to `SyncObjectField`, but only stores a reference to the given sub structure. This is useful if you have a parent / children system, or a composing system

```ts

class Folder extends SyncObject {

    static template = Template.create("Folder", Folder)

    readonly name = new AnyField("")

}

class File extends SyncObject {

    static template = Template.create("File", File)

    readonly folder = new SyncObjectRefField(File.template)
    readonly name = new AnyField("")

}

model.register(Folder.template)
model.register(File.template)

const root = model.instantiate(Folder.template)
root.name.set("root")

const file = model.instantiate(File.template)
file.name.set("HowToMakeMoney.ppt")
file.folder.set(root)

model.tick()
```

## RPCs