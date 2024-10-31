class TreeNode<T> {

    public value: T
    public left: TreeNode<T> | null
    public right: TreeNode<T> | null
    public height: number
    // a가 b보다 작으면 음수, 같으면 0, 크면 양수를 반환
    private readonly compare: (a: T, b: T) => number

    constructor(value: T, compare: (a: T, b: T) => number) {
        this.value = value
        this.left = null
        this.right = null
        this.compare = compare
        this.height = 1
    }

    get balanceFactor(): number {
        return (this.left?.height ?? 0) - (this.right?.height ?? 0)
    }

    // 트리에 값을 추가한 뒤, 루트 노드를 반환
    add(value: T): TreeNode<T> {
        if (this.isSmall(value)) {
            this.left = this.left?.add(value) ?? new TreeNode(value, this.compare)
        } else if (this.isBig(value)) {
            this.right = this.right?.add(value) ?? new TreeNode(value, this.compare)
        } else {
            // 중복된 값은 허용하지 않음
            throw new Error('중복된 값은 허용하지 않습니다.')
        }
        this.updateHeight()
        return this.fixBalance()
    }

    // 트리에서 값을 삭제한 뒤, 루트 노드를 반환
    remove(value: T): TreeNode<T> | null {
        let result
        if (this.isSmall(value)) {
            // 왼쪽 서브트리에게 위임
            this.left = this.left?.remove(value) ?? null
            result = this
        } else if (this.isBig(value)) {
            // 오른쪽 서브트리에게 위임
            this.right = this.right?.remove(value) ?? null
            result = this
        } else {
            // 삭제할 노드가 자신일 때
            if (this.left !== null && this.right === null) {
                // 1. 왼쪽 서브트리만 존재하는 경우 왼쪽 서브트리를 자신의 자리로 이동
                result = this.left
            } else if (this.right !== null && this.left === null) {
                // 2. 오른쪽 서브트리만 존재하는 경우 오른쪽 서브트리를 자신의 자리로 이동
                result = this.right
            } else if (this.right !== null) {
                // 3. 양쪽 서브트리가 모두 존재하는 경우.
                // 개발자 임의로 오른쪽 서브트리의 leftmost 노드를 삭제할 노드로 대체
                const leftmostValue = this.right.leftmostChild().value
                // right 서브트리의 leftmost 노드를 삭제
                this.right = this.right.remove(leftmostValue)
                // 자신을 leftmost 노드로 대체
                this.value = leftmostValue
                result = this
            } else {
                // 4. 자식이 없는 경우 본인을 삭제
                result = null
            }
        }
        this.updateHeight()
        return result?.fixBalance() ?? null
    }

    // 트리에 값이 포함되어 있는지 확인
    contains(value: T): boolean {
        if (this.isSmall(value)) {
            return this.left?.contains(value) ?? false
        } else if (this.isBig(value)) {
            return this.right?.contains(value) ?? false
        } else {
            return true
        }
    }

    private isBig(value: T): boolean {
        return this.compare(this.value, value) < 0
    }

    private isSmall(value: T): boolean {
        return this.compare(this.value, value) > 0
    }

    private leftmostChild(): TreeNode<T> {
        if (this.left === null) {
            return this
        }
        return this.left.leftmostChild()
    }

    private rightmostChild(): TreeNode<T> {
        if (this.right === null) {
            return this
        }
        return this.right.rightmostChild()
    }

    private fixBalance(): TreeNode<T> {
        if (!(this.balanceFactor === 2 || this.balanceFactor === -2)) {
            return this
        }

        if (this.balanceFactor === 2) {
            if (this.left!.balanceFactor === 1) {
                // LL 상태
                return this.rotateRight()
            } else {
                // LR 상태
                return this.rotateLeftRight()
            }
        } else {
            if (this.right!.balanceFactor === -1) {
                // RR 상태
                return this.rotateLeft()
            } else {
                // RL 상태
                return this.rotateRightLeft()
            }
        }
    }

    private rotateRight(): TreeNode<T> {
        const root = this.left!;
        this.left = root.right
        root.right = this

        this.updateHeight()
        root.updateHeight()

        return root
    }

    private rotateLeft(): TreeNode<T> {
        const root = this.right!;
        this.right = root.left
        root.left = this

        this.updateHeight()
        root.updateHeight()

        return root
    }

    private rotateLeftRight(): TreeNode<T> {
        this.left = this.left!.rotateLeft()
        return this.rotateRight()
    }

    private rotateRightLeft(): TreeNode<T> {
        this.right = this.right!.rotateRight()
        return this.rotateLeft()
    }

    private updateHeight(): void {
        this.height = Math.max(this.left?.height ?? 0, this.right?.height ?? 0) + 1
    }


}

export class AvlTree<T> {
    private root: TreeNode<T> | null = null
    // a가 b보다 작으면 음수, 같으면 0, 크면 양수를 반환
    private readonly compare: (a: T, b: T) => number

    constructor(compare: (a: T, b: T) => number) {
        this.compare = compare
    }

    // 트리에 값을 추가
    add(value: T) {
        this.root = this.root?.add(value) ?? new TreeNode(value, this.compare)
    }

    // 트리에서 값을 삭제
    remove(value: T) {
        this.root = this.root?.remove(value) ?? null
    }

    // 트리에 값이 포함되어 있는지 확인
    contains(value: T): boolean {
        return this.root?.contains(value) ?? false
    }


}