import { Component, OnInit } from "@angular/core";

@Component({
  selector: "bottom-navigation-component",
  template: `
<BottomNavigation #bottomNavigation>

  <TabStrip>

    <TabStripItem title="TabStripItem 0" iconSource="res://icon">
    </TabStripItem>

    <TabStripItem>
      <Label text="TabStripItem 1">
      </Label>
      <Image src="res://icon">
      </Image>
    </TabStripItem>

    <TabStripItem title="TabStripItem X" iconSource="res://x">
      <Label text="TabStripItem 2">
      </Label>
      <Image src="res://icon">
      </Image>
    </TabStripItem>

  </TabStrip>

  <TabContentItem>
    <StackLayout>
      <Label text="TabContentItem 0">
      </Label>
      <Button (tap)="goTo(bottomNavigation, 1)" text="go to 1">
      </Button>
    </StackLayout>
  </TabContentItem>

  <TabContentItem>
    <StackLayout>
      <Label text="TabContentItem 1">
      </Label>
      <Button (tap)="goTo(bottomNavigation, 2)" text="go to 2">
      </Button>
    </StackLayout>
  </TabContentItem>

  <TabContentItem>
    <StackLayout>
      <Label text="TabContentItem 2">
      </Label>
      <Button (tap)="goTo(bottomNavigation, 0)" text="go to 0">
      </Button>
    </StackLayout>
  </TabContentItem>

</BottomNavigation>
  `,
})

export class BottomNavigation implements OnInit {

  public ngOnInit(): void { }

  goTo(bottomNavigation: any, index: number) {
    bottomNavigation.selectedIndex = index;
  }

}
