import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Confirm, Loader } from 'semantic-ui-react';

export async function getStaticProps({ params }) {
	const res = await fetch('http://localhost:3000/api/notes/' + params.id);
	const {data} = await res.json();

	return {
		props : {
			note: data
		}
	}
}

export async function getStaticPaths() {
    const res = await fetch('http://localhost:3000/api/notes');
	const {data} = await res.json();
    const paths = data.map(note=>{
        return {
            params:{
                id: note._id
            }
        }
    });
    return {
        paths,
        fallback: false
    }
}

const Note = ({note}) => {

    const [confirm, setConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    const deleteNote = async () =>{
        const noteId = router.query.id;

        console.log(noteId);
        try {
            const deleted = await fetch(`http://localhost:3000/api/notes/${noteId}`,{
                method: 'DELETE'
            });
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(isDeleting){
            deleteNote();
        }
    }, [isDeleting])

    const openConfirmModal = () => {
        setConfirm(true);
    }

    const closeConfirmModal = () => {
        setConfirm(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        closeConfirmModal();
    }

    return (
        <div className='note-container'>
            {isDeleting ?
             <Loader></Loader> :
            <>
                <h1>{note.title}</h1>
                <p>{note.description}</p>

                <Button color='red' onClick={openConfirmModal}>Delete</Button>
            </>}
            <Confirm 
                open={confirm}
                onCancel={closeConfirmModal}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default Note;