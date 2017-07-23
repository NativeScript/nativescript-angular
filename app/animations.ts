import { animation, style, animate } from "@angular/animations";

export const fadeAnimation = animation([
    style({ opacity: "{{ from }}" }),
    animate("{{ time }}", style({ opacity: "{{ to }}" }))
], {
    params: { time: "1s" }
});

