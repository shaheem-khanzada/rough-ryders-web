import React, { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

const styles = {
    tag: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        background: 'aliceblue',
        borderRadius: 10,
    },
    tagButton: {
        height: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        borderRadius: 50,
        paddingTop: 4,
    }
}

const TagsInput = ({ tags, setTags, placeholder, label }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = () => {
        if (inputValue.trim() !== '' && !tags.includes(inputValue)) {
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <React.Fragment>
            <Form.Label>{label}</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                        }
                    }}
                />
                <Button variant="primary" onClick={handleAddTag}>Add</Button>
            </InputGroup>
            <div className="tag-container">
                {tags.map((tag, index) => (
                    <div style={styles.tag} key={index}>
                        {tag}
                        <Button
                            style={styles.tagButton}
                            variant="danger"
                            onClick={() => handleRemoveTag(index)}>
                            ×
                        </Button>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};

export default TagsInput;
