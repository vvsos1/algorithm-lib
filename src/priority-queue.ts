class Heap<T> {
    // Complete Binary Tree 형태로 저장되는 배열
    // 부모노드의 인덱스가 i일 때, 왼쪽 자식노드의 인덱스는 2i + 1, 오른쪽 자식노드의 인덱스는 2i + 2
    // 자식노드의 인덱스가 i일 때, 부모노드의 인덱스는 (i - 1) / 2 의 몫
    private readonly heap: T[];

    // a가 b보다 우선순위가 높으면 양수, 낮으면 음수, 같으면 0을 반환
    private readonly compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compare;
    }

    // 힙의 크기를 반환
    get size() {
        return this.heap.length;
    }

    // 원소를 우선순위가 높은대로 힙에 삽입
    // logN의 시간복잡도
    enqueue(value: T) {
        this.heap.push(value);
        this.reheapificationUpward();
    }

    // 원소를 우선순위가 높은대로 힙에서 추출
    // logN의 시간복잡도
    dequeue(): T {
        if (this.heap.length === 0) {
            throw new Error('Heap is empty');
        }

        const root = this.heap[0];
        this.heap[0] = this.heap[this.heap.length-1]!;
        this.heap.pop();
        this.reheapificationDownward();
        return root;
    }

    private parentIndex(childIndex: number) {
        return Math.floor((childIndex - 1) / 2);
    }

    private leftChildIndex(parentIndex: number) {
        return parentIndex * 2 + 1;
    }

    private rightChildIndex(parentIndex: number) {
        return parentIndex * 2 + 2;
    }


    // 트리의 가장 아래 원소부터 위로 올라가며 부모노드와 우선순위를 비교하여 위치를 바꾸는 메서드
    private reheapificationUpward() {
        let childIndex = this.heap.length - 1;
        let parentIndex = this.parentIndex(childIndex);

        while (childIndex > 0 && this.isBig(childIndex, parentIndex)) {
            [this.heap[childIndex], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[childIndex]];
            childIndex = parentIndex;
            parentIndex = this.parentIndex(childIndex);
        }
    }

    // 트리의 가장 위 원소부터 아래로 내려가며 두 자식노드 중 우선순위가 큰 자식과 우선순위를 비교하여 위치를 바꾸는 메서드
    private reheapificationDownward() {
        let parentIndex = 0
        let leftChildIndex = this.leftChildIndex(parentIndex);
        let rightChildIndex = this.rightChildIndex(parentIndex);

        // 모든 자식노드가 부모노드보다 작을 때까지 반복
        while (leftChildIndex < this.heap.length && (this.isBig(leftChildIndex, parentIndex) || this.isBig(rightChildIndex, parentIndex))) {
            let largeChildIndex;
            if (rightChildIndex >= this.heap.length)
                largeChildIndex = leftChildIndex;
            else
                largeChildIndex = this.isBig(leftChildIndex, rightChildIndex) ? leftChildIndex : rightChildIndex;
            [this.heap[parentIndex], this.heap[largeChildIndex]] = [this.heap[largeChildIndex], this.heap[parentIndex]];
            parentIndex = largeChildIndex;
            leftChildIndex = this.leftChildIndex(parentIndex);
            rightChildIndex = this.rightChildIndex(parentIndex);
        }
    }

    private isBig(index1: number, index2: number): boolean {
        if (this.isValidIndex(index1) && !this.isValidIndex(index2)) {
            return true
        } else if (!this.isValidIndex(index1) && this.isValidIndex(index2)) {
            return false
        }
        return this.compare(this.heap[index1], this.heap[index2]) > 0;
    }

    private isValidIndex(index: number) {
        return 0 <= index && index < this.heap.length;

    }
}

export {Heap, Heap as PriorityQueue};