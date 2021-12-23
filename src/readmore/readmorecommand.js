import {Command} from "@ckeditor/ckeditor5-core";

export default class ReadMoreCommand extends Command {
    execute() {
        const editor = this.editor;
        editor.model.change( writer => {
            const anchorElement = writer.createElement( 'anchor', {
                name: "readmore"
            } );
            editor.model.insertContent( anchorElement, editor.model.document.selection );
        });
    }
}