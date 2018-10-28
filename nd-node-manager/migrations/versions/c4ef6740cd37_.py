"""empty message

Revision ID: c4ef6740cd37
Revises: 
Create Date: 2018-10-25 15:01:34.141420

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c4ef6740cd37'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('nodes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('ip', sa.String(length=250), nullable=False),
    sa.Column('port', sa.Integer(), nullable=False),
    sa.Column('output_txhash', sa.String(length=250), nullable=False),
    sa.Column('output_txid', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('nodes')
    # ### end Alembic commands ###
