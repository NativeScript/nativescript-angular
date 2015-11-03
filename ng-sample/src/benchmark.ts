import {StackLayout} from 'ui/layouts/stack-layout';
import {Button} from 'ui/button';
import {Label} from 'ui/label';
import {Inject, Component, View, NgIf, NgFor} from 'angular2/angular2';
import {ApplicationRef} from 'angular2/src/core/application_ref';
import {LifeCycle} from 'angular2/src/core/life_cycle/life_cycle';
import * as profiling from './profiling';

@Component({selector: 'tree', inputs: ['data']})
@View({
  directives: [TreeComponent, NgIf],
  template:
      `<StackLayout>
          <Label [text]="data.value"></Label>
          <StackLayout *ng-if="data.right != null">
            <tree [data]='data.right'></tree>
          </StackLayout>
          <StackLayout *ng-if="data.left != null">
            <tree [data]='data.left'></tree>
          </StackLayout>
      </StackLayout>
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
    <StackLayout>
        <Label text='Benchmark!' fontSize='20' verticalAlignment='center' padding='20'></Label>
        <Button Text="Baseline test" (tap)="baselineTest(baseline)"></Button>
        <StackLayout #baseline></StackLayout>
        <Button Text="Component test" (tap)="componentTest()"></Button>
        <StackLayout #component>
            <tree [data]='initDataNg'></tree>
        </StackLayout>
    </StackLayout>
`,
})
export class Benchmark {
    private count: number = 0;
    private maxDepth: number = 10;
    public initDataNg = new TreeNode('', null, null);
    public initDataBaseline = new TreeNode('', null, null);

    constructor(private appRef: ApplicationRef, private lifeCycle: LifeCycle) {
    }

    public baselineTest(container: StackLayout) {
        this.createBaselineDom();

        profiling.start('baseline');
        this.renderBaselineNode(container, this.initDataBaseline);
        profiling.stop('baseline');

        container.removeChildren();
    }

    public componentTest() {
        this.initDataNg = new TreeNode('', null, null);
        this.lifeCycle.tick();

        profiling.start('angular');
        this.createNgDom();
        profiling.stop('angular');
    }

    private renderBaselineNode(container: StackLayout, node: TreeNode) {
        let valueLabel = new Label();
        valueLabel.text = node.value;
        container.addChild(valueLabel);

        if (node.left) {
            let childContainer = new StackLayout();
            container.addChild(childContainer);
            this.renderBaselineNode(childContainer, node.left);
        }
        if (node.right) {
            let childContainer = new StackLayout();
            container.addChild(childContainer);
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
