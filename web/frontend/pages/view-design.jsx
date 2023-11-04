import React, { useState, useEffect, useCallback } from 'react'
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
  useIndexResourceState,
  Thumbnail,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { designMakerCss } from "../assets";
import {ViewMajor,ImageMajor} from '@shopify/polaris-icons'

export default function ViewDesign() {
  const { t } = useTranslation();
  const [listItems, initList] = useState([])
  const [listFields, initField] = useState([])
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('selectedView');

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
        initList(result.settings)
		initField(result.prints)
      console.log(result.prints);
      })
      .catch((e) => {
        console.log(e.message)
      })
  }, [])

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(listFields);

  const [active, setActive] = useState(false);
  const toggleModal = useCallback(() => setActive((active) => !active), []);
  const activator = <Button onClick={toggleModal}>Open</Button>


    if(listItems) {
     var part_image = <Thumbnail source={ImageMajor} size="large" />
     if (listItems.part_image && listItems.part_image.includes("http")) {
       part_image = <Thumbnail source={listItems.part_image} size="large" />
     }
     var mask_image = <Thumbnail source={ImageMajor} size="large" />
     if (listItems.mask_image && listItems.mask_image.includes("http")) {
       mask_image = <Thumbnail source={listItems.mask_image} size="large" />
     }
      return (
        <TextContainer>
              <Page primaryAction={{content: <Link url="/" monochrome="false" removeUnderline="true" target>BACK</Link>}} >
                  <Layout.Section>
                    <LegacyCard title="PRODUCT TAG" sectioned>
                      <VerticalStack gap="3">
                        {listItems.product_tag}
                      </VerticalStack>
                    </LegacyCard>
                  </Layout.Section>
                  <Layout.Section>
                    <LegacyCard title="DESIGN LAYERS" sectioned>
                      <VerticalStack gap="20">
                      <FormLayout.Group>                      
                        {part_image}
                        {mask_image}
                        </FormLayout.Group>
                      </VerticalStack>
                    </LegacyCard>
                  </Layout.Section>
                  <Layout.Section>
                    <LegacyCard title="PRINT LAYOUT IMAGES" sectioned>
                      <VerticalStack gap="2">
						{listFields.map(item => (
							<FormLayout.Group>      
							  <p><b>Name:-</b> {item.name} <br/> <b>Short Code:-</b> {item.short_code} <br/> <b>Image:- </b></p>
							  <p><Thumbnail source={item.layer_content} size="large" /></p>
							</FormLayout.Group>
						  ))}
                      </VerticalStack>
                    </LegacyCard>
                  </Layout.Section>
                  <Layout.Section>
                    <LegacyCard title="PRINT CONFIGURATION" sectioned>
                      <VerticalStack gap="3">
                      <FormLayout.Group>
                        <p><b>Font Size:-</b> {listItems.text_font_size}</p>
                        <p><b>Text Lenght:-</b> {listItems.text_max_length}</p>
                        <p><b>Font Style:-</b> {listItems.text_font_style}</p>
                       </FormLayout.Group>
                      </VerticalStack>
                    </LegacyCard>
                  </Layout.Section>
                  <br/>   
              </Page>
          <TitleBar/>
          <Modal
            open={active}
            onClose={toggleModal}
            title="Get a shareable link"
            primaryAction={{
              content: 'Close',
              onAction: toggleModal,
            }}
          >
            <Modal.Section>
              <LegacyStack vertical>
                <LegacyStack.Item>
                  <TextContainer>
                    <p>
                      You can share this discount link with your customers via
                      email or social media. Your discount will be automatically
                      applied at checkout.
                    </p>
                  </TextContainer>
                </LegacyStack.Item>
              </LegacyStack>
            </Modal.Section>
          </Modal>
        </TextContainer>
      );
    }
  else {
    return ( 
      <Page primaryAction={{content: <Link url="/" monochrome="false" removeUnderline="true" target>BACK</Link>}} >
        <Layout.Section>
          <LegacyCard sectioned>
            <VerticalStack gap="3">
            Data not available
            </VerticalStack>
          </LegacyCard>
        </Layout.Section>    
      </Page>);
  }
}
