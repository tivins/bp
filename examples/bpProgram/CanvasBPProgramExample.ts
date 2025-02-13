import {BPContextItem, CanvasBP} from "../../src/CanvasBP";
import {Blueprint} from "../../src/Blueprint";
import {BPColors} from "../../src/BPColors";
import {Toasts} from "../../src/components/Toasts";
import {NopNode} from "./nodes/NopNode";
import {PrintNode} from "./nodes/PrintNode";
import {EntryNode} from "./nodes/EntryNode";
import {EndNode} from "./nodes/EndNode";
import {ConstNode} from "./nodes/ConstNode";
import {IfNode} from "./nodes/IfNode";
import {CompareNode} from "./nodes/CompareNode";
import {FlipFlopNode} from "./nodes/FlipFlopNode";

class CanvasBPProgramExample extends CanvasBP {
    getContextElements(): BPContextItem[] {
        const elements = super.getContextElements();
        elements.push(new BPContextItem("Nop", () => new NopNode()));
        elements.push(new BPContextItem("PrintNode", () => new PrintNode()));
        elements.push(new BPContextItem("EntryNode", () => new EntryNode()));
        elements.push(new BPContextItem("EndNode", () => new EndNode()));
        elements.push(new BPContextItem("ConstNode", () => new ConstNode()));
        elements.push(new BPContextItem("IfNode", () => new IfNode()));
        elements.push(new BPContextItem("CompareNode", () => new CompareNode()));
        elements.push(new BPContextItem("FlipFlopNode", () => new FlipFlopNode()));
        return elements;
    }

    /**
     * Override the validation when a link is created.
     * @param emitToasts
     */
    validateLinking(emitToasts = false) {
        if (!super.validateLinking(emitToasts)) {
            return false;
        }
        if (!this.createLinkAnchor || !this.overAnchor) return false;

        let anchorStart = this.createLinkAnchor.object
        let anchorEnd = this.overAnchor.object

        if (this.createLinkAnchor.node === this.overAnchor.node) {
            if (emitToasts) {
                Toasts.instance.addToastDefault('Not possible to link anchor of the same node. This will be changed in the future', 5, 'error')
            }
            return false;
        }

        if ((anchorStart.type === 'branch' && anchorEnd.type !== 'branch') || (anchorStart.type !== 'branch' && anchorEnd.type === 'branch')) {
            if (emitToasts) Toasts.instance.addToastDefault('Branch should be linked together', 5, 'error')
            return false;
        }
        if (anchorStart.type === 'branch' && anchorEnd.type === 'branch') {
            const linkStartID = this.blueprint.getLinksOf(this.createLinkAnchor);
            const linkEndID = this.blueprint.getLinksOf(this.overAnchor);
            // if ((linkStartID > -1 || linkEndID > -1)) {
            //     if (emitToasts) {
            //         const msg = document.createElement('div');
            //         msg.className = 'p-1';
            //         msg.textContent = 'Branch cannot be lined twice';
            //         const a = document.createElement('a');
            //         a.href = '#';
            //         a.className = 'button empty squared';
            //         a.textContent = 'Unlink';
            //
            //         const tmpOverAnchor = this.overAnchor;
            //         const tmpCreateAnchor = this.createLinkAnchor;
            //         a.addEventListener('click', (e: MouseEvent) => {
            //             e.preventDefault();
            //             this.blueprint.unlink(tmpOverAnchor);
            //             this.blueprint.link(tmpOverAnchor, tmpCreateAnchor);
            //         });
            //         Toasts.instance.addToast([msg, a], 5, 'error');
            //     }
            //     return false;
            // }
            if (this.createLinkAnchor.side === this.overAnchor.side) {
                if (emitToasts) Toasts.instance.addToastDefault(`A branch 'out' cannot be linked to a branch 'in', and vice-versa.`, 5, 'error')
                return false;
            }
        }

        if (anchorStart.type !== 'any' && anchorEnd.type !== 'any' && anchorStart.type !== anchorEnd.type) {
            if (emitToasts) Toasts.instance.addToastDefault('Types mismatch', 5, 'error')
            return false;
        }

        return true;
    }
}
customElements.define('canvas-bp-program-example', CanvasBPProgramExample);

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.margin = '0';

    Toasts.instance.addToastDefault("<tivins-icon icon='lightbulb' outline></tivins-icon> Use RMB to create a new node.", 0)
    Toasts.instance.addToastDefault("BP Program Example 😊", 2);

    const canvas = new CanvasBPProgramExample(new Blueprint(), new BPColors());
    document.body.append(canvas);
    canvas.resize();
    canvas.center();
    canvas.run();
})
