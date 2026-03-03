"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    { id: 1, title: "Casa de Piedra", src: "/images/casa-de-piedra.webp" },
    { id: 2, title: "Piscina Vista 2", src: "/images/piscina-2.webp" },
    { id: 3, title: "Fondo", src: "/images/fondo.webp" },
    { id: 4, title: "Piscina", src: "/images/piscina.webp" },
    {
      id: 5,
      title: "Dormitorio Grande",
      src: "/images/dormitorio-grande.webp",
    },
    { id: 6, title: "Terraza", src: "/images/terraza.webp" },
    { id: 7, title: "Parrilla", src: "/images/parrilla.webp" },
    { id: 8, title: "Mesa de Pool", src: "/images/pool.webp" },
    { id: 9, title: "Mesa de Ping Pong", src: "/images/ping-pong.webp" },
    { id: 10, title: "Arco", src: "/images/arco.webp" },
    {
      id: 11,
      title: "Baño Chico Vista 2",
      src: "/images/baño-chico-2.webp",
    },
    { id: 12, title: "Baño Chico", src: "/images/baño-chico.webp" },
    { id: 13, title: "Cuarto Chico", src: "/images/cuarto-chico.webp" },
    { id: 14, title: "Baño Grande", src: "/images/baño-grande.webp" },
    {
      id: 15,
      title: "Dormitorio con Cuchetas",
      src: "/images/cuchetas.webp",
    },
    { id: 16, title: "Comedor", src: "/images/comedor.webp" },
    {
      id: 17,
      title: "Casa de Piedra de Noche",
      src: "/images/casa-de-piedra-noche.webp",
    },
    { id: 18, title: "Fondo de Noche", src: "/images/fondo-noche.webp" },
  ];

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <Box bg="gray.50" minH="100vh">
      <Box h="5.25rem" />
      {/* Header Section */}
      <Box py={{ base: 16, md: 20 }}>
        <Container maxW="container.xl">
          <VStack gap={4} textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="primary.600"
            >
              Nuestros espacios
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
            >
              Galería de fotos
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} maxW="3xl">
              Explora nuestra hermosa propiedad
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Gallery Grid */}
      <Container maxW="container.xl" pb={{ base: 12, md: 20 }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {images.map((image, index) => (
            <Box
              key={image.id}
              h="350px"
              borderRadius="2xl"
              overflow="hidden"
              position="relative"
              cursor="pointer"
              onClick={() => openModal(index)}
              _hover={{
                transform: "scale(1.02)",
                boxShadow: "2xl",
              }}
              transition="all 0.3s"
              boxShadow="lg"
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.900"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Close Button */}
          <IconButton
            position="absolute"
            top={4}
            right={4}
            onClick={closeModal}
            aria-label="Close"
            bg="whiteAlpha.300"
            color="white"
            size="lg"
            fontSize="2xl"
            _hover={{ bg: "whiteAlpha.500" }}
            backdropFilter="blur(10px)"
            borderRadius="full"
            zIndex={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            ✕
          </IconButton>

          {/* Previous Button */}
          <IconButton
            position="absolute"
            left={{ base: 2, md: 8 }}
            top="50%"
            transform="translateY(-50%)"
            onClick={goToPrevious}
            aria-label="Previous image"
            bg="whiteAlpha.300"
            color="white"
            size="lg"
            fontSize="3xl"
            _hover={{ bg: "whiteAlpha.500" }}
            backdropFilter="blur(10px)"
            borderRadius="full"
            zIndex={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            ←
          </IconButton>

          {/* Image Container */}
          <Box
            maxW="90vw"
            maxH="90vh"
            w="auto"
            h="auto"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {/* Main Image */}
            <Box
              position="relative"
              maxW="1200px"
              maxH="70vh"
              w="90vw"
              h="70vh"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="2xl"
            >
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].title}
                fill
                style={{ objectFit: "contain" }}
                sizes="90vw"
                priority
              />
            </Box>

            {/* Image Info */}
            <Box mt={6} textAlign="center">
              <Text color="whiteAlpha.700" fontSize="sm">
                {selectedImage + 1} / {images.length}
              </Text>
            </Box>
          </Box>

          {/* Next Button */}
          <IconButton
            position="absolute"
            right={{ base: 2, md: 8 }}
            top="50%"
            transform="translateY(-50%)"
            onClick={goToNext}
            aria-label="Next image"
            bg="whiteAlpha.300"
            color="white"
            size="lg"
            fontSize="3xl"
            _hover={{ bg: "whiteAlpha.500" }}
            backdropFilter="blur(10px)"
            borderRadius="full"
            zIndex={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            →
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
