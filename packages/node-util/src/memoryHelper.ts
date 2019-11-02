import v8 from 'v8';

export function getUsedHeap() {
  return v8.getHeapStatistics().used_heap_size;
}
