import {PriorityQueue} from "./priority-queue";

export class Dijkstra {
    // 인접 리스트. Map<출발정점, Map<도착정점, 가중치>> 형태
    private adjacencyList: Map<string, Map<string, number>>;

    constructor() {
        this.adjacencyList = new Map();
    }

    // 단방향 간선 추가
    addEdge(vertex1: string, vertex2: string, weight: number) {
        const map = this.adjacencyList.get(vertex1) ?? new Map();
        map.set(vertex2, weight);
        this.adjacencyList.set(vertex1, map);
    }

    // 양방향 간선 추가
    addBiEdge(vertex1: string, vertex2: string, weight: number) {
        this.addEdge(vertex1, vertex2, weight);
        this.addEdge(vertex2, vertex1, weight);
    }

    // 시간복잡도: nlogn
    findShortestPath(start: string) {
        const MAX_NUMBER = Math.floor(Number.MAX_SAFE_INTEGER / 2);
        // start로부터 각 정점들까지 소요되는 최소 비용
        const costs = new Map<string, number>();
        // start로부터 각 정점들까지의 최소 비용 경로. 단 마지막 정점은 제외
        const paths = new Map<string, string[]>();
        const queue = new PriorityQueue<{ vertex: string, cost: number }>((a, b) => b.cost - a.cost);

        costs.set(start, 0);
        queue.enqueue({vertex: start, cost: 0});

        for (const vertex of this.adjacencyList.keys()) {
            if (vertex !== start) {
                costs.set(vertex, MAX_NUMBER);
                queue.enqueue({vertex, cost: MAX_NUMBER});
            }
            paths.set(vertex, [])
        }

        while (queue.size > 0) {
            const currentVertex = queue.dequeue()!;
            const neighbors = this.adjacencyList.get(currentVertex.vertex);

            if (neighbors) {
                for (const [neighbor, weight] of neighbors.entries()) {
                    // currentVertex를 거쳐 갈 경우 비용
                    const newCost = costs.get(currentVertex.vertex)! + weight;
                    // currentVertex를 거쳐서 가는 것이 빠른지 판단
                    if (newCost < costs.get(neighbor)!) {
                        costs.set(neighbor, newCost);
                        queue.enqueue({vertex: neighbor, cost: newCost});
                        // neighbor까지의 경로를 currentVertex까지의 경로를 이용해 업데이트
                        const path = [...paths.get(currentVertex.vertex)!, currentVertex.vertex];
                        paths.set(neighbor, path);
                    }
                }
            }
        }

        return {costs, paths};
    }

}

