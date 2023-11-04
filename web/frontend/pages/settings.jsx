import React, { useState } from 'react';
import { Form, FormLayout, TextField, Button, Page, Layout } from '@shopify/polaris';

const MyForm = () => {
  const [formData, setFormData] = useState({
    // Define your form fields here
	shop: 'ds-desingmaker.myshopify.com',
	shop_id: '',
    product_tag: '',
    part_image: '',
	mask_image: '',
	text_font_size: '',
	text_font_style: '',
	text_max_length: '',
  });

  const handleSubmit = async () => {
    try {
      // Send the form data to your Laravel backend using AJAX or fetch
      const response = await fetch('/api/add-design', {
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
  <Page>
 
    <Form onSubmit={handleSubmit}>
      <FormLayout>
	  
	  <TextField
          label="Shopi ID"
          value={formData.shop_id}
          onChange={(value) => setFormData({ ...formData, shop_id: value })}
        />
		
        <TextField
          label="Product Tag"
          value={formData.product_tag}
          onChange={(value) => setFormData({ ...formData, product_tag: value })}
        />
		
		<TextField
          label="Part Image"
          value={formData.part_image}
          onChange={(value) => setFormData({ ...formData, part_image: value })}
        />
		
		<TextField
          label="Mask Image"
          value={formData.mask_image}
          onChange={(value) => setFormData({ ...formData, mask_image: value })}
        />
		
		<TextField
          label="Font Size"
          value={formData.text_font_size}
          onChange={(value) => setFormData({ ...formData, text_font_size: value })}
        />
		
		<TextField
          label="Font Style"
          value={formData.text_font_style}
          onChange={(value) => setFormData({ ...formData, text_font_style: value })}
        />
		
		<TextField
          label="Text Max Length"
          value={formData.text_max_length}
          onChange={(value) => setFormData({ ...formData, text_max_length: value })}
        />
		
        <Button primary submit>
          Submit
        </Button>
      </FormLayout>
    </Form>
	
	</Page>
  );
};

export default MyForm;