class TreeNode<T> {

    public value: T
    public left: TreeNode<T> | null
    public right: TreeNode<T> | null
    // a가 b보다 작으면 음수, 같으면 0, 크면 양수를 반환
    private readonly compare: (a: T, b: T) => number

    constructor(value: T, compare: (a: T, b: T) => number) {
        this.value = value
        this.left = null
        this.right = null
        this.compare = compare
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
        return this
    }

    // 트리에서 값을 삭제한 뒤, 루트 노드를 반환
    remove(value: T): TreeNode<T> | null {
        if (this.isSmall(value)) {
            // 왼쪽 서브트리에게 위임
            this.left = this.left?.remove(value) ?? null
            return this
        } else if (this.isBig(value)) {
            // 오른쪽 서브트리에게 위임
            this.right = this.right?.remove(value) ?? null
            return this
        } else {
            // 삭제할 노드가 자신일 때
            if (this.left !== null && this.right === null) {
                // 1. 왼쪽 서브트리만 존재하는 경우 왼쪽 서브트리를 자신의 자리로 이동
                return this.left
            } else if (this.right !== null && this.left === null) {
                // 2. 오른쪽 서브트리만 존재하는 경우 오른쪽 서브트리를 자신의 자리로 이동
                return this.right
            } else if (this.right !== null) {
                // 3. 양쪽 서브트리가 모두 존재하는 경우.
                // 개발자 임의로 오른쪽 서브트리의 leftmost 노드를 삭제할 노드로 대체
                const leftmostValue = this.right.leftmostChild().value
                // right 서브트리의 leftmost 노드를 삭제
                this.right = this.right.remove(leftmostValue)
                // 자신을 leftmost 노드로 대체
                this.value = leftmostValue
                return this
            } else {
                // 4. 자식이 없는 경우 본인을 삭제
                return null
            }
        }
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

}

export class BinarySearchTree<T> {
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