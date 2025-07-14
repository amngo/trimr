import { renderHook, act } from '@testing-library/react';
import { useBulkSelectionStore } from '../useBulkSelectionStore';

describe('useBulkSelectionStore', () => {
    beforeEach(() => {
        // Clear store before each test
        act(() => {
            useBulkSelectionStore.getState().clearSelection();
        });
    });

    describe('initial state', () => {
        it('should have empty selection initially', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            expect(result.current.selectedLinkIds).toEqual(new Set());
            expect(result.current.selectAll).toBe(false);
        });
    });

    describe('selectLink', () => {
        it('should add link to selection', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(true);
            expect(result.current.selectedLinkIds.size).toBe(1);
        });

        it('should add multiple links to selection', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
                result.current.selectLink('link-2');
                result.current.selectLink('link-3');
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(true);
            expect(result.current.selectedLinkIds.has('link-2')).toBe(true);
            expect(result.current.selectedLinkIds.has('link-3')).toBe(true);
            expect(result.current.selectedLinkIds.size).toBe(3);
        });

        it('should not add duplicate links', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
                result.current.selectLink('link-1');
                result.current.selectLink('link-1');
            });

            expect(result.current.selectedLinkIds.size).toBe(1);
            expect(result.current.selectedLinkIds.has('link-1')).toBe(true);
        });
    });

    describe('deselectLink', () => {
        it('should remove link from selection', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
                result.current.selectLink('link-2');
            });

            expect(result.current.selectedLinkIds.size).toBe(2);

            act(() => {
                result.current.deselectLink('link-1');
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(false);
            expect(result.current.selectedLinkIds.has('link-2')).toBe(true);
            expect(result.current.selectedLinkIds.size).toBe(1);
        });

        it('should handle deselecting non-existent link gracefully', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
            });

            const initialSize = result.current.selectedLinkIds.size;

            act(() => {
                result.current.deselectLink('non-existent');
            });

            expect(result.current.selectedLinkIds.size).toBe(initialSize);
        });

        it('should turn off selectAll when deselecting', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectAllLinks(['link-1', 'link-2', 'link-3']);
            });

            expect(result.current.selectAll).toBe(true);

            act(() => {
                result.current.deselectLink('link-1');
            });

            expect(result.current.selectAll).toBe(false);
        });
    });

    describe('toggleLink', () => {
        it('should select unselected link', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.toggleLink('link-1');
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(true);
        });

        it('should deselect selected link', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(true);

            act(() => {
                result.current.toggleLink('link-1');
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(false);
        });

        it('should toggle multiple links independently', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.toggleLink('link-1'); // select
                result.current.toggleLink('link-2'); // select
                result.current.toggleLink('link-1'); // deselect
            });

            expect(result.current.selectedLinkIds.has('link-1')).toBe(false);
            expect(result.current.selectedLinkIds.has('link-2')).toBe(true);
            expect(result.current.selectedLinkIds.size).toBe(1);
        });
    });

    describe('selectAll', () => {
        it('should select all provided link IDs', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            const linkIds = ['link-1', 'link-2', 'link-3', 'link-4'];

            act(() => {
                result.current.selectAllLinks(linkIds);
            });

            expect(result.current.selectedLinkIds.size).toBe(4);
            linkIds.forEach((id) => {
                expect(result.current.selectedLinkIds.has(id)).toBe(true);
            });
            expect(result.current.selectAll).toBe(true);
        });

        it('should replace existing selection', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('old-link');
            });

            expect(result.current.selectedLinkIds.has('old-link')).toBe(true);

            const newLinkIds = ['link-1', 'link-2'];
            act(() => {
                result.current.selectAllLinks(newLinkIds);
            });

            expect(result.current.selectedLinkIds.has('old-link')).toBe(false);
            expect(result.current.selectedLinkIds.size).toBe(2);
            newLinkIds.forEach((id) => {
                expect(result.current.selectedLinkIds.has(id)).toBe(true);
            });
        });

        it('should handle empty array', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
            });

            act(() => {
                result.current.selectAllLinks([]);
            });

            expect(result.current.selectedLinkIds.size).toBe(0);
            expect(result.current.selectAll).toBe(true);
        });

        it('should handle duplicate IDs in array', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectAllLinks([
                    'link-1',
                    'link-2',
                    'link-1',
                    'link-3',
                    'link-2',
                ]);
            });

            expect(result.current.selectedLinkIds.size).toBe(3);
            expect(result.current.selectedLinkIds.has('link-1')).toBe(true);
            expect(result.current.selectedLinkIds.has('link-2')).toBe(true);
            expect(result.current.selectedLinkIds.has('link-3')).toBe(true);
        });
    });

    describe('clearSelection', () => {
        it('should clear all selected links', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectAllLinks(['link-1', 'link-2', 'link-3']);
            });

            expect(result.current.selectedLinkIds.size).toBe(3);
            expect(result.current.selectAll).toBe(true);

            act(() => {
                result.current.clearSelection();
            });

            expect(result.current.selectedLinkIds.size).toBe(0);
            expect(result.current.selectAll).toBe(false);
        });

        it('should work when selection is already empty', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.clearSelection();
            });

            expect(result.current.selectedLinkIds.size).toBe(0);
            expect(result.current.selectAll).toBe(false);
        });
    });

    describe('toggleAll', () => {
        it('should select all when nothing is selected', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            const linkIds = ['link-1', 'link-2', 'link-3'];

            act(() => {
                result.current.toggleSelectAll(linkIds);
            });

            expect(result.current.selectedLinkIds.size).toBe(3);
            linkIds.forEach((id) => {
                expect(result.current.selectedLinkIds.has(id)).toBe(true);
            });
            expect(result.current.selectAll).toBe(true);
        });

        it('should clear selection when all are selected', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            const linkIds = ['link-1', 'link-2', 'link-3'];

            act(() => {
                result.current.selectAllLinks(linkIds);
            });

            expect(result.current.selectAll).toBe(true);

            act(() => {
                result.current.toggleSelectAll(linkIds);
            });

            expect(result.current.selectedLinkIds.size).toBe(0);
            expect(result.current.selectAll).toBe(false);
        });

        it('should select all when partial selection exists', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            const linkIds = ['link-1', 'link-2', 'link-3'];

            act(() => {
                result.current.selectLink('link-1');
            });

            expect(result.current.selectedLinkIds.size).toBe(1);
            expect(result.current.selectAll).toBe(false);

            act(() => {
                result.current.toggleSelectAll(linkIds);
            });

            expect(result.current.selectedLinkIds.size).toBe(3);
            linkIds.forEach((id) => {
                expect(result.current.selectedLinkIds.has(id)).toBe(true);
            });
            expect(result.current.selectAll).toBe(true);
        });

        it('should handle empty linkIds array', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
            });

            act(() => {
                result.current.toggleSelectAll([]);
            });

            expect(result.current.selectedLinkIds.size).toBe(0);
            expect(result.current.selectAll).toBe(true);
        });
    });

    describe('derived state', () => {
        it('should correctly compute selectAll for different scenarios', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            const linkIds = ['link-1', 'link-2', 'link-3'];

            // Initially false
            expect(result.current.selectAll).toBe(false);

            // After selecting some but not all
            act(() => {
                result.current.selectLink('link-1');
                result.current.selectLink('link-2');
            });
            expect(result.current.selectAll).toBe(false);

            // After manually selecting all individual links
            act(() => {
                result.current.selectLink('link-3');
            });
            expect(result.current.selectAll).toBe(false); // Still false because selectAll wasn't used

            // After using selectAll
            act(() => {
                result.current.selectAllLinks(linkIds);
            });
            expect(result.current.selectAll).toBe(true);
        });
    });

    describe('performance and edge cases', () => {
        it('should handle large numbers of selections efficiently', () => {
            const { result } = renderHook(() => useBulkSelectionStore());
            const manyIds = Array.from({ length: 1000 }, (_, i) => `link-${i}`);

            const start = performance.now();
            act(() => {
                result.current.selectAllLinks(manyIds);
            });
            const end = performance.now();

            expect(result.current.selectedLinkIds.size).toBe(1000);
            expect(end - start).toBeLessThan(100); // Should be fast
        });

        it('should handle selecting many individual links', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                for (let i = 0; i < 100; i++) {
                    result.current.selectLink(`link-${i}`);
                }
            });

            expect(result.current.selectedLinkIds.size).toBe(100);
        });

        it('should maintain Set integrity', () => {
            const { result } = renderHook(() => useBulkSelectionStore());

            act(() => {
                result.current.selectLink('link-1');
                result.current.selectLink('link-2');
            });

            // selectedLinkIds should be a proper Set
            expect(result.current.selectedLinkIds instanceof Set).toBe(true);
            expect(Array.from(result.current.selectedLinkIds)).toEqual([
                'link-1',
                'link-2',
            ]);
        });
    });
});
