import classcat from 'classcat';
import { ComponentChildren } from 'preact';

import { c } from 'src/components/helpers';
import { useEffect } from 'preact/hooks';

import { Scrollable } from './Scrollable';
import { useStoredScrollState } from './ScrollStateContext';

interface ScrollContainerProps {
  children?: ComponentChildren;
  className?: string;
  triggerTypes: string[];
  isStatic?: boolean;
  id: string;
  index?: number;
}

export function ScrollContainer({
  className,
  children,
  triggerTypes,
  isStatic,
  id,
  index,
}: ScrollContainerProps) {
  const { setRef, scrollRef } = useStoredScrollState(id, index);

  useEffect(() => {
    const handleWheel = event => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += event.deltaY + event.deltaX;
        }
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      // 添加事件监听器，不要忘记传递 `{ passive: false }`
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        // 组件卸载时移除事件监听器
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []); // 确保依赖项为空数组，这样代码只会在装载和卸载时运行

  return (
    <div ref={setRef} className={classcat([className, c('scroll-container')])}>
      {isStatic ? (
        children
      ) : (
        <Scrollable scrollRef={scrollRef} triggerTypes={triggerTypes}>
          {children}
        </Scrollable>
      )}
    </div>
  );
}
