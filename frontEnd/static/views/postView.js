import abstract from "./abstract.js";

export default class extends abstract {
    constructor(params) {
        super(params);
        this.setTitle("Viewing Posts");
    }

    async getHtml() {
        console.log(this.params.id)
        return  `
            <h1> View Posts </h1>

            <p> Post one </p>

            <p> 
            <a href="/" data-link>Go To Main Page</a>
            </p>

        `;

    }
}