export type LinkedListNode<T> = {
    value: T
    next: LinkedListNode<T> | null
    prev: LinkedListNode<T> | null
}

export type LinkedList<T> = {
    head: LinkedListNode<T> | null
    tail: LinkedListNode<T> | null
    size: number
}

export namespace LinkedList {

    export function create<T>(): LinkedList<T> {
        return {
            head: null,
            tail: null,
            size: 0
        }
    }

    export function push<T>(list: LinkedList<T>, value: T): LinkedListNode<T> {
        const node: LinkedListNode<T> = {
            value,
            next: null,
            prev: list.tail
        }

        if (list.tail) {
            list.tail.next = node
        } else {
            list.head = node
        }

        list.tail = node
        list.size++

        return node
    }

    export function unshift<T>(list: LinkedList<T>, value: T): LinkedListNode<T> {
        const node: LinkedListNode<T> = {
            value,
            next: list.head,
            prev: null
        }

        if (list.head) {
            list.head.prev = node
        } else {
            list.tail = node
        }

        list.head = node
        list.size++

        return node
    }

    export function remove<T>(list: LinkedList<T>, node: LinkedListNode<T>): void {
        if (node.prev) {
            node.prev.next = node.next
        } else {
            list.head = node.next
        }

        if (node.next) {
            node.next.prev = node.prev
        } else {
            list.tail = node.prev
        }

        list.size--
    }

    export function* iter<T>(list: LinkedList<T>) {
        let current = list.head
        while (current) {
            yield current.value
            current = current.next
        }
    }

    export function* iterReverse<T>(list: LinkedList<T>) {
        let current = list.tail
        while (current) {
            yield current.value
            current = current.prev
        }
    }

}