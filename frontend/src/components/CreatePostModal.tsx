import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlus } from 'lucide-react';
import { ModalShell } from '../components/TemplateModal';
import { axiosClient } from '../lib/axios';
import { createPostSchema, type CreatePostFormValues } from '../lib/postSchemas';

async function createPost(data: CreatePostFormValues): Promise<void> {
  const formData = new FormData();
  formData.append('image', data.image[0]);
  if (data.text) formData.append('text', data.text);

  await axiosClient.post('/post', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
 
  // <button onClick={() => NiceModal.show(CreatePostModal)}>Novo post</button>

export const CreatePostModal = NiceModal.create(() => {
  const modal = useModal(); // controla visibilidade/resultado deste modal específico
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      modal.resolve(); // resolve a Promise retornada por NiceModal.show(...)
      modal.hide();
    },
  });

  const imageFiles = watch('image');

  function handleImageChange(files: FileList | null) {
    if (files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
    }
  }

  const onSubmit = (data: CreatePostFormValues) => {
    mutation.mutate(data);
  };

  return (
    <ModalShell
      title="Novo post"
      visible={modal.visible}
      onClose={() => modal.hide()}
      onExited={() => modal.remove()} // desmonta o componente após a animação de saída
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label
          htmlFor="image"
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-neutral-700 bg-neutral-950 text-neutral-500 transition-colors hover:border-pink-500/50"
        >
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
          ) : (
            <>
              <ImagePlus size={28} />
              <span className="font-mono text-xs">Escolher imagem</span>
            </>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            {...register('image', {
              onChange: (e) => handleImageChange(e.target.files),
            })}
          />
        </label>
        {errors.image && (
          <p className="font-mono text-xs text-red-400">{errors.image.message}</p>
        )}

        <div>
          <textarea
            {...register('text')}
            rows={3}
            placeholder="Escreva uma legenda…"
            className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-pink-500/60"
          />
          {errors.text && (
            <p className="mt-1 font-mono text-xs text-red-400">{errors.text.message}</p>
          )}
        </div>

        {mutation.isError && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
            Não foi possível publicar. Tente novamente.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => modal.hide()}
            className="rounded-md px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || !imageFiles?.length}
            className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-400 disabled:opacity-50"
          >
            {mutation.isPending ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
});