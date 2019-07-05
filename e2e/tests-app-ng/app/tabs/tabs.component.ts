import { Component, OnInit } from "@angular/core";

@Component({
  selector: "tabs-component",
  template: `
<Tabs id="tabs">

  <TabStrip>

    <TabStripItem title="TabStripItem 1" iconSource="res://icon">
    </TabStripItem>

    <TabStripItem>
      <Label text="TabStripItem 2">
      </Label>
      <Image src="res://icon">
      </Image>
    </TabStripItem>

    <TabStripItem title="TabStripItem 3" iconSource="res://icon">
    </TabStripItem>

  </TabStrip>

  <TabContentItem>
    <StackLayout>
      <Label text="TabContentItem 1">
      </Label>
    </StackLayout>
  </TabContentItem>

  <TabContentItem>
    <StackLayout>
      <Label text="TabContentItem 2">
      </Label>
    </StackLayout>
  </TabContentItem>

  <TabContentItem>
    <StackLayout>
      <Label text="TabContentItem 3">
      </Label>
    </StackLayout>
  </TabContentItem>

</Tabs>
  `,
})

export class TabsComponent implements OnInit {
  public ngOnInit(): void { }
}
