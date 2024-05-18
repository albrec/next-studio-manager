import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

export default function DeleteModal({ name, open, onDelete, onClose }: { name: string, open: boolean, onDelete: Function, onClose: Function }) {
    function handleDelete() {
        onDelete()
        onClose()
    }

    return (
        <Dialog open={ open } onClose={ () => onClose() }>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to delete <strong>{ name }</strong>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={ () => onClose() }>Oops, no!</Button>
                <Button onClick={ handleDelete } autoFocus>Yes, delete.</Button>
            </DialogActions>
        </Dialog>
    )
}