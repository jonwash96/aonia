export class ThreeState {
	constructor(initialValue) {
		this.value = initialValue || undefined;
	}

	value

	set = (value) => this.value = value

	toggle = () => this.value = !this.value

	use = () => [value, setter, toggle]

}

export default function use3State(initialValue, asObjectLiteral=false) {
	const instance = new ThreeState(initialValue);
	return !asObjectLiteral
		? instance.use()
		: instance;
}