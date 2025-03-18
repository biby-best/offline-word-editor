<template>
    <div class="editor-container">
      <div class="editor-toolbar">
        <button
          v-for="item in toolbarItems"
          :key="item.name"
          @click="item.action"
          :class="['toolbar-button', { 'is-active': item.isActive && item.isActive() }]"
          :title="item.title"
        >
          {{ item.icon }}
        </button>
        <input
          v-if="showLinkInput"
          ref="linkInput"
          type="text"
          class="link-input p-1 border border-gray-300 rounded"
          v-model="linkUrl"
          placeholder="https://example.com"
          @keydown.enter="setLink"
          @keydown.esc="showLinkInput = false"
        />
      </div>
      
      <editor-content :editor="editor" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Underline from '@tiptap/extension-underline';
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  
  const props = defineProps<{
    modelValue: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'update', value: string): void;
  }>();
  
  const editor = ref<Editor | null>(null);
  const showLinkInput = ref(false);
  const linkUrl = ref('');
  const linkInput = ref<HTMLInputElement | null>(null);
  
  // Initialize the editor
  onMounted(() => {
    editor.value = new Editor({
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: true,
          linkOnPaste: true,
        }),
        Image,
      ],
      content: props.modelValue,
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
        emit('update', editor.getHTML());
      },
    });
  });
  
  // Clean up the editor on component unmount
  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy();
    }
  });
  
  // Update editor content when the model value changes
  watch(() => props.modelValue, (newContent) => {
    // Only update if the editor exists and the content has changed
    if (editor.value && editor.value.getHTML() !== newContent) {
      editor.value.commands.setContent(newContent, false);
    }
  });
  
  // Toolbar actions
  const toolbarItems = [
    {
      name: 'bold',
      icon: 'B',
      title: 'Bold',
      action: () => editor.value?.chain().focus().toggleBold().run(),
      isActive: () => editor.value?.isActive('bold') ?? false,
    },
    {
      name: 'italic',
      icon: 'I',
      title: 'Italic',
      action: () => editor.value?.chain().focus().toggleItalic().run(),
      isActive: () => editor.value?.isActive('italic') ?? false,
    },
    {
      name: 'underline',
      icon: 'U',
      title: 'Underline',
      action: () => editor.value?.chain().focus().toggleUnderline().run(),
      isActive: () => editor.value?.isActive('underline') ?? false,
    },
    {
      name: 'heading1',
      icon: 'H1',
      title: 'Heading 1',
      action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.value?.isActive('heading', { level: 1 }) ?? false,
    },
    {
      name: 'heading2',
      icon: 'H2',
      title: 'Heading 2',
      action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.value?.isActive('heading', { level: 2 }) ?? false,
    },
    {
      name: 'paragraph',
      icon: '¶',
      title: 'Paragraph',
      action: () => editor.value?.chain().focus().setParagraph().run(),
      isActive: () => editor.value?.isActive('paragraph') ?? false,
    },
    {
      name: 'bulletList',
      icon: '• List',
      title: 'Bullet List',
      action: () => editor.value?.chain().focus().toggleBulletList().run(),
      isActive: () => editor.value?.isActive('bulletList') ?? false,
    },
    {
      name: 'orderedList',
      icon: '1. List',
      title: 'Ordered List',
      action: () => editor.value?.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.value?.isActive('orderedList') ?? false,
    },
    {
      name: 'link',
      icon: '🔗',
      title: 'Link',
      action: () => {
        if (editor.value?.isActive('link')) {
          editor.value?.chain().focus().unsetLink().run();
        } else {
          showLinkInput.value = true;
          setTimeout(() => {
            linkInput.value?.focus();
          }, 10);
        }
      },
      isActive: () => editor.value?.isActive('link') ?? false,
    },
    {
      name: 'image',
      icon: '🖼️',
      title: 'Image',
      action: () => {
        const url = prompt('Enter the URL of the image:');
        if (url) {
          editor.value?.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      name: 'undo',
      icon: '↩️',
      title: 'Undo',
      action: () => editor.value?.chain().focus().undo().run(),
    },
    {
      name: 'redo',
      icon: '↪️',
      title: 'Redo',
      action: () => editor.value?.chain().focus().redo().run(),
    },
  ];
  
  // Set link function
  const setLink = () => {
    if (linkUrl.value) {
      // Add https:// if the URL doesn't have a protocol
      const url = linkUrl.value.match(/^https?:\/\//) 
        ? linkUrl.value 
        : `https://${linkUrl.value}`;
        
      editor.value?.chain().focus().setLink({ href: url }).run();
    } else {
      editor.value?.chain().focus().unsetLink().run();
    }
    
    showLinkInput.value = false;
    linkUrl.value = '';
  };
  </script>