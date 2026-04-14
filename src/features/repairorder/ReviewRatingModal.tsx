import { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { submitReview } from '@/services/reviewApi';

type ReviewRatingModalProps = {
  orderId: number;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
  onDuplicate: () => void;
};

export default function ReviewRatingModal({
  orderId,
  userId,
  onClose,
  onSuccess,
  onDuplicate,
}: ReviewRatingModalProps) {
  const { t } = useTranslation('common');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = rating >= 1 && rating <= 5;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await submitReview({
        userId,
        orderId,
        rating,
        comment: comment.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const err = e as { status?: number; code?: string; message?: string };
      if (err.status === 409 || err.code === 'DUPLICATE_REVIEW') {
        onDuplicate();
        onClose();
        return;
      }
      setError(err.message || t('order.review_error_generic', 'ไม่สามารถส่งรีวิวได้'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4 font-prompt">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('order.review_modal_title', 'ให้คะแนนช่าง')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            disabled={submitting}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-sm text-gray-600 mb-3 text-center">
              {t('order.review_stars_hint', 'เลือกคะแนน 1–5 ดาว')}
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                  aria-label={`${n} ${t('order.review_stars', 'ดาว')}`}
                >
                  <Star
                    size={36}
                    className={
                      n <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-100 text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-sm text-gray-600 mb-1.5">
              {t('order.review_comment_label', 'ความคิดเห็น (ไม่บังคับ)')}
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-y min-h-[96px]"
              placeholder={t('order.review_comment_placeholder', 'แชร์ประสบการณ์ของคุณ...')}
              disabled={submitting}
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 py-2.5 rounded-lg text-sm"
            disabled={submitting}
          >
            {t('order.review_btn_cancel', 'ยกเลิก')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="btn-primary flex-1 py-2.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {t('order.review_btn_sending', 'กำลังส่ง...')}
              </span>
            ) : (
              t('order.review_btn_submit', 'ส่งรีวิว')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
