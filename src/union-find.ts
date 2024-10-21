export class DisjointSet<T> {
    private readonly parent: Map<T, T>;
    private readonly rank: Map<T, number>;
    private readonly size: Map<T, number>;

    constructor() {
        this.parent = new Map<T, T>();
        this.rank = new Map<T, number>();
        this.size = new Map<T, number>();
    }

    // 집합을 사용 전 각 원소에 대한 초기화를 수행하는 메서드
    makeSet(x: T) {
        if (this.parent.get(x) !== undefined) {
            return;
        }
        this.parent.set(x, x)
        this.rank.set(x, 0)
        this.size.set(x, 1)
    }

    find(x: T): T {
        if (x !== this.parent.get(x)) {
            this.parent.set(x, this.find(this.parent.get(x)!));
        }
        return this.parent.get(x)!;
    }

    union(x: T, y: T) {
        const xRoot = this.find(x);
        const yRoot = this.find(y);

        if (this.rank.get(xRoot)! > this.rank.get(yRoot)!) {
            this.parent.set(yRoot, xRoot);
            this.size.set(xRoot, this.size.get(xRoot)! + this.size.get(yRoot)!);
            this.size.set(yRoot, 0);
        } else if (this.rank.get(xRoot)! < this.rank.get(yRoot)!) {
            this.parent.set(xRoot, yRoot);
            this.size.set(yRoot, this.size.get(yRoot)! + this.size.get(xRoot)!);
            this.size.set(xRoot, 0);
        } else {
            this.parent.set(xRoot, yRoot);
            this.rank.set(yRoot, this.rank.get(yRoot)! + 1);
            this.size.set(yRoot, this.size.get(yRoot)! + this.size.get(xRoot)!);
            this.size.set(xRoot, 0);
        }
    }

    sizeOf(x: T): number {
        return this.size.get(this.find(x))!;
    }
}

