import { useRouter } from 'next/router';

import {useState, useEffect} from 'react';

import { Button, Form, Loader } from 'semantic-ui-react';

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

const Edit = ({note}) => {
    const [form, setForm] = useState({title: note.title, description: note.description});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const updateNote = async () =>{
        try {
            const res = await fetch(`http://localhost:3000/api/notes/${note._id}`,{
                method: 'PUT',
                headers: {
                    "Accept" : "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(isSubmitting){
            if(Object.keys(errors).length === 0){
                updateNote();
            }
            else{
                setIsSubmitting(false);
            }
        }
    }, [errors])

    

    const validate = () => {
        let err = {};
        if(!form.title){
            err.title = 'Title is required';
        }

        if(!form.description){
            err.description = 'Description is required';
        }

        return err;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let errs = validate();
        setErrors(errs);
        setIsSubmitting(true);
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    }

    return (
        <div className='form-container'>
            <h1>
                Edit Note
            </h1>
            <div>
                {
                    isSubmitting ?
                    <Loader active inline='centered'></Loader> :
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            fluid
                            label="Title"
                            placeholder='Title'
                            name='title'
                            value={form.title}
                            error={errors.title ? 
                                {
                                    content: 'Please enter a title',
                                    pointing: 'below'
                                } : null}
                            onChange={handleChange}
                        ></Form.Input>
                        <Form.TextArea
                            fluid
                            label="Description"
                            placeholder='Description'
                            name='description'
                            value={form.description}
                            error={errors.description ? 
                                {
                                    content: 'Please enter a description',
                                    pointing: 'below'
                                } : null}
                            onChange={handleChange}
                        />
                        <Button type='submit'>Update</Button>
                    </Form>
                }
            </div>
        </div>
    )

}

export default Edit;


