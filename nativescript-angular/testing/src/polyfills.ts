if (typeof Node === 'undefined' && !global.Node) {
	class DummyNode {}
	global.Node = DummyNode as any;
}
