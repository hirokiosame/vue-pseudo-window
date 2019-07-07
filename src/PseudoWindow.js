export default {
	name: 'pseudo-window',

	props: {
		document: Boolean,
	},

	render() {
		const defSlot = this.$slots.default;
		return defSlot && defSlot.length === 1 ? defSlot[0] : defSlot;
	},

	data() {
		return { handlers: [] };
	},

	mounted() {
		this.bindEventListeners();
	},
	destroyed() {
		this.unbindEventListeners();
	},

	methods: {
		bindEventListeners() {
			const { $listeners } = this;
			for (const event in $listeners) {
				if (!$listeners.hasOwnProperty(event)) {
					continue;
				}
				const e = this.normalizeEvent(
					this.document ? window.document : window,
					event,
					$listeners[event],
				);
				e.target.addEventListener(e.name, e.handler, e.opts);
				this.handlers.push(e);
			}
		},

		unbindEventListeners() {
			while (this.handlers.length) {
				const e = this.handlers.shift();
				e.target.removeEventListener(e.name, e.handler, e.opts);
			}
		},

		normalizeEvent(target, name, handler) {
			const passive = name.charAt(0) === '&';
			name = passive ? name.slice(1) : name;
			const once = name.charAt(0) === '~'; // Prefixed last, checked first

			name = once ? name.slice(1) : name;
			const capture = name.charAt(0) === '!';
			name = capture ? name.slice(1) : name;
			return {
				target,
				name,
				handler,
				opts: {
					once,
					capture,
					passive,
				},
			};
		},
	},
};
