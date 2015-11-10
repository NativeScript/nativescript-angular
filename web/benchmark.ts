import {Inject, Component, View, NgIf, NgFor} from 'angular2/angular2';
import {ApplicationRef} from 'angular2/src/core/application_ref';
import {LifeCycle} from 'angular2/src/core/life_cycle/life_cycle';
import * as profiling from './profiling.ts';

@Component({selector: 'tree', inputs: ['data']})
@View({
  directives: [TreeComponent, NgIf],
  template:
      `<div>
          <span>{{data.value}}</span>
          <div *ng-if="data.right != null">
            <tree [data]='data.right'></tree>
          </div>
          <div *ng-if="data.left != null">
            <tree [data]='data.left'></tree>
          </div>
      </div>
      `
})
class TreeComponent {
  data: TreeNode;
}

@Component({
	selector: 'benchmark',
})
@View({
    directives: [NgIf, NgFor, TreeComponent],
	template: `
    <div>
        <h1>Benchmark!</h1>
        <input type="button" value="Baseline test" (click)="baselineTest(baseline)">
        <div #baseline></div>
        <input type="button" value="Component test" (click)="componentTest()">
        <div #component>
            <tree [data]='initDataNg'></tree>
        </div>
    </div>
`,
})
export class Benchmark {
    private count: number = 0;
    private maxDepth: number = 10;
    public initDataNg = new TreeNode('', null, null);
    public initDataBaseline = new TreeNode('', null, null);

    constructor(private appRef: ApplicationRef, private lifeCycle: LifeCycle) {
    }

    public baselineTest(container: Node) {
       this.createBaselineDom();

        profiling.start('baseline');
        this.renderBaselineNode(container, this.initDataBaseline);
        profiling.stop('baseline');

        //container.innerHTML = '';
    }

    public componentTest() {
        this.initDataNg = new TreeNode('', null, null);
        this.lifeCycle.tick();

        profiling.start('angular');
        this.createNgDom();
        profiling.stop('angular');
    }

    private renderBaselineNode(container: Node, node: TreeNode) {
        let span = document.createElement('span');
        span.innerHTML = node.value;
        container.appendChild(span);

        if (node.left) {
            let childContainer = document.createElement('div');
            container.appendChild(childContainer);
            this.renderBaselineNode(childContainer, node.left);
        }
        if (node.right) {
            let childContainer = document.createElement('div');
            container.appendChild(childContainer);
            this.renderBaselineNode(childContainer, node.right);
        }
    }

    private createBaselineDom() {
        var values = this.count++ % 2 == 0 ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*'] :
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '-'];
        this.initDataBaseline = buildTree(this.maxDepth, values, 0);
        this.lifeCycle.tick();
    }

    private createNgDom() {
        var values = this.count++ % 2 == 0 ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*'] :
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '-'];
        this.initDataNg = buildTree(this.maxDepth, values, 0);
        this.lifeCycle.tick();
    }
}


class TreeNode {
  value: string;
  left: TreeNode;
  right: TreeNode;
  constructor(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

var nodes = 0;

function buildTree(maxDepth, values, curDepth) {
    if (curDepth === 0) {
        nodes = 0;
    } else {
        nodes++;
    }
    if (maxDepth === curDepth) return new TreeNode('', null, null);
    let result = new TreeNode(values[curDepth], buildTree(maxDepth, values, curDepth + 1), buildTree(maxDepth, values, curDepth + 1));
    if (curDepth === 0) {
        console.log(`${nodes} nodes created.`);
    }
    return result;
}
