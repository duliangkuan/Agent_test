import React, { useState } from 'react'
import { Card, Checkbox, Button, Space, Typography, Tag, Divider } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { TestCategory } from '../../types'

const { Title, Paragraph } = Typography

interface Step2TestSelectionProps {
  categories: TestCategory[]
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
  onNext: () => void
  onPrev: () => void
}

const Step2TestSelection: React.FC<Step2TestSelectionProps> = ({
  categories,
  selectedCategories,
  onCategoriesChange,
  onNext,
  onPrev,
}) => {
  const [checkedAll, setCheckedAll] = useState(
    selectedCategories.length === categories.length
  )

  const handleCheckAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      onCategoriesChange(categories.map((cat) => cat.id))
      setCheckedAll(true)
    } else {
      onCategoriesChange([])
      setCheckedAll(false)
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...selectedCategories, categoryId])
    } else {
      onCategoriesChange(selectedCategories.filter((id) => id !== categoryId))
    }
    setCheckedAll(selectedCategories.length + (checked ? 1 : -1) === categories.length)
  }

  return (
    <div>
      <Title level={4}>Select Test Categories</Title>
      <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
        Please select the test categories you want to execute. You can select all or some categories.
      </Paragraph>

      <div style={{ marginBottom: '16px' }}>
        <Checkbox
          checked={checkedAll}
          indeterminate={
            selectedCategories.length > 0 && selectedCategories.length < categories.length
          }
          onChange={handleCheckAll}
        >
          <strong>Select All ({selectedCategories.length}/{categories.length})</strong>
        </Checkbox>
      </div>

      <Divider />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {categories.map((category) => (
          <Card
            key={category.id}
            size="small"
            style={{
              border: selectedCategories.includes(category.id)
                ? '2px solid #1890ff'
                : '1px solid #d9d9d9',
            }}
          >
            <Checkbox
              checked={selectedCategories.includes(category.id)}
              onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
            >
              <div style={{ marginLeft: '24px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {category.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  {category.description}
                </div>
                <Tag color="blue">{category.test_case_count} test cases</Tag>
              </div>
            </Checkbox>
          </Card>
        ))}
      </div>

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onPrev}>Previous</Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={selectedCategories.length === 0}
        >
          Next
        </Button>
      </Space>
    </div>
  )
}

export default Step2TestSelection
