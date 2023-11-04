import { useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import {
  TextContainer,
  Image,
  Stack,
  Page,
  Layout,
  Text,
  VerticalStack,
  LegacyCard,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  LegacyTabs,
  Link,
  TextField,
  FormLayout,
  Form,
  DisplayText,
  Select,
  ChoiceList,
  Modal,
  Frame,
  ButtonGroup,
  LegacyStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { designMakerCss } from "../assets";

export default function PageName() {
  const { t } = useTranslation();
  const [formEdit, setFormEdit] = useState(false);
  const [formData, setFormData] = useState({
    shop_id: 1,
    product_tag: '',
    status:1,
    part_image: '',
    mask_image: '',
    text_font_size: '',
    text_font_style: 'normal',
    text_max_length: '',
	fields:'',
	
  });
  const [fields, setFields] = useState([{ name: '', short_code: '', layer_content: '' }]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selected, setSelected] = useState(0);
  const [selected1, setSelected1] = useState(['normal']);
  const [status, setStaus] = useState(1);
  const [active, setActive] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('selectedView');

  // Fetch request
  if(id != '' && id != null) {
    const fetchData = async () => {
      const response = await fetch('/api/viewdesign/' + id)
    
      if (!response.ok) {
        throw new Error('Data coud not be fetched!')
      } else {
        return response.json()
      }
    }
    useEffect(() => {
      fetchData()
        .then((result) => {
          setFormData(result.settings)
		  setFields(result.prints)
          setFormEdit(true);
        })
        .catch((e) => {
          console.log(e.message)
        })
    }, [])
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    const validationPrintErrors = validatePrintForm(fields);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit the data
      setErrors({});
    //  console.log('Form data:', fields.map((field) => field.value));
      var uri = '/api/add-design';
      if(formEdit && id!= '') {
        var uri = 'api/editdesign/' + id;       
      }
      try {
        const response = await fetch(uri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setActive(true);
        } else {
          // Handle error, e.g., show an error message
        }
      } catch (error) {
        // Handle network errors or other exceptions
      }
      setSuccessMessage('Form submitted successfully!');
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};    
    if (!data.product_tag) errors.product_tag = 'Tag is required';
    if (!data.part_image) errors.part_image = 'Part image is required';
    if (!data.mask_image) errors.mask_image = 'Mask image is required';
    return errors;
  };

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

const tabs = [
    {
      id: 'all-customers-1',
      content: 'Add Design',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'accepts-marketing-1',
      content: 'Instructions Guide',
      panelID: 'accepts-marketing-content-1',
    },
  ];
  
  // Status field data
  const options = [
    {label: 'Enable', value: '1'},
    {label: 'Disable', value: '2'},
  ];
  const handleSelectChange = useCallback(
    (value) => setStaus(value),
    [],
  );

  const toggleModal = useCallback(() => setActive((active) => !active), []);
  const activator = <Button onClick={toggleModal}>Open</Button>

  const validatePrintForm = (data) => {
    let errors = {};
    
    if (!data.product_tag) errors.product_tag = 'Tag is required';
    if (!data.part_image) errors.part_image = 'Part image is required';
    if (!data.mask_image) errors.mask_image = 'Mask image is required';
    return errors;
  };

  const handleAddField = () => {
    setFields([...fields, { name: '', short_code: '', layer_content: '' }]);
  };

  const handleFieldChange = (index, value, field) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
    console.log(fields);
	
	setFormData({ ...formData, fields });
  };

  const handleRemoveField = async (index,id) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
	
	if(id){
		try {
		  // Send the form data to your Laravel backend using AJAX or fetch
		  const response = await fetch('/api/remove-print/'+id, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({'id':id}),
		  });

		  if (response.ok) {
			// Handle success, e.g., show a success message
			location.reload(true);
		  } else {
			// Handle error, e.g., show an error message
		  }
		} catch (error) {
		  // Handle network errors or other exceptions
		}
	}
	
  };


  return (
    <TextContainer>
      <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <LegacyCard.Section>
              <Page primaryAction={{content: <Link url="/" monochrome="false" removeUnderline="true" target>BACK</Link>}}>
              <Layout.Section>
                <LegacyCard sectioned>
                  <VerticalStack gap="3">
                    <Form onSubmit={handleSubmit}>
                      <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          label="Product TAG Name*"
                          value={formData.product_tag}
                          placeholder="Add product tag"
                          onChange={(value) => handleChange('product_tag', value)}
                          error={errors.product_tag}
                        />
                        <Select
                          label="Status"
                          options={options}
                          onChange={handleSelectChange}
                          value={status}
                        />
                        </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          label="Part Image*"
                          value={formData.part_image}
                          placeholder="Add part image path"
                          onChange={(value) => handleChange('part_image', value)}
                          error={errors.part_image}
                        />
                        <TextField
                          label="Mask Image*"
                          value={formData.mask_image}
                          placeholder="Add mask image path"
                          onChange={(value) => handleChange('mask_image', value)}
                          error={errors.mask_image}
                        />
                        </FormLayout.Group>
                         <br/><VerticalStack gap="2">
                          <Text as="h1" variant="headingXs">PRINT IMAGES</Text>
                          <Divider borderColor="border-inverse" />
                         </VerticalStack>
                        {fields.map((field, index) => (
                          <FormLayout.Group condensed>
                            <TextField
                              label="Print Name"
                              value={field.name}
                              placeholder="Print Name"
                              onChange={(value) => handleFieldChange(index, value, 'name')}
                            />
                            <TextField
                              label="Print Short Code"
                              value={field.short_code}
                              placeholder="Print Short Code"
                              onChange={(value) => handleFieldChange(index, value, 'short_code')}
                            />
                            <TextField
                              label="Print Image"
                              value={field.layer_content}
                              placeholder="Print Image"
                              onChange={(value) => handleFieldChange(index, value, 'layer_content')}
                            />
                            <div className={`btn-group ${index == 0 ? 'hide' : 'show'}`}>
                                <Button destructive spacing="160px" onClick={() => handleRemoveField(index,field.id)}>Remove</Button>
                            </div>
                          </FormLayout.Group>
                        ))}
                        <Button primary onClick={handleAddField}>Add More</Button>
                       <br/><VerticalStack gap="2">
                        <Text as="h1" variant="headingXs">SETTINGS</Text>
                        <Divider borderColor="border-inverse" />
                       </VerticalStack>
                      <FormLayout.Group>
                        <TextField
                          label="Text Font Size: (px)"
                          type="number"
                          value={formData.text_font_size}
                          placeholder="Print Name"
                          onChange={(value) => handleChange('text_font_size', value)}
                          error={errors.text_font_size}
                        />
                        <TextField
                          label="Text Max Length"
                          value={formData.text_max_length}
                          type="number"
                          placeholder="Text Max Length"
                          onChange={(value) => handleChange('text_max_length', value)}
                          error={errors.text_max_length}
                        />
                        </FormLayout.Group>
                       <br/><VerticalStack gap="2">
                        <Text as="h1" variant="headingXs">FONT STYLE</Text>
                        <Divider borderColor="border-inverse" />
                       </VerticalStack>
                      <ChoiceList
                        title="Font"
                        choices={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Italic', value: 'italic'},
                        ]}
						selected={formData.text_font_style}
                        onChange={(value) => handleChange('text_font_style', value)}
                      />

                        <Button primary submit>
                          Submit
                        </Button>
                      </FormLayout>
                    </Form>
                    {successMessage && (
                      <p>{successMessage}</p>
                    )}
                  </VerticalStack>
                </LegacyCard>
              </Layout.Section>    
          </Page>
        </LegacyCard.Section>
      </LegacyTabs>
      <TitleBar/>
      <Modal
        open={active}
        onClose={toggleModal}
        title="successfully Updated"
        primaryAction={{
          content: 'Close',
          onAction: toggleModal,
        }}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <TextContainer>
                <p>successfully saved data</p>
              </TextContainer>
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
    </TextContainer>
  );
}
