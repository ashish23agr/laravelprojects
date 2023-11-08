import React, { useState } from 'react';
import { Form, FormLayout, TextField, Button } from '@shopify/polaris';

const MyForm = () => {
  const [formData, setFormData] = useState({
    // Define your form fields here
    name: '',
    email: '',
  });

  const handleSubmit = async () => {
    try {
      // Send the form data to your Laravel backend using AJAX or fetch
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      // Handle network errors or other exceptions
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          label="Name"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />
        <TextField
          label="Email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        <Button primary submit>
          Submit
        </Button>
      </FormLayout>
    </Form>
  );
};

export default MyForm;