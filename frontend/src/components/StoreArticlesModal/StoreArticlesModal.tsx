import React, { useEffect } from 'react';
import JSONPretty from 'react-json-pretty';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core';
import Card from '../Card';

interface StoreArticlesModalProps {
  message: string;
  openMessageModal: boolean;
  onCloseMessageModal: () => void;
}

const StoreArticlesModal: React.FC<StoreArticlesModalProps> = ({
  message,
  openMessageModal,
  onCloseMessageModal,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (openMessageModal) onOpen();
  }, [openMessageModal]);

  return (
    <Modal
      blockScrollOnMount
      isOpen={isOpen}
      scrollBehavior="inside"
      onClose={() => {
        onCloseMessageModal();
        onClose();
      }}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Message Payload</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card>
            <JSONPretty id="json-pretty" data={message}></JSONPretty>
          </Card>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

StoreArticlesModal.displayName = 'StoreArticlesModal';

export default StoreArticlesModal;
